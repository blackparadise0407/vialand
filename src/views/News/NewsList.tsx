import { useCallback, useEffect, useState } from 'react'
import {
  collection,
  DocumentData,
  endBefore,
  getDocs,
  limit,
  orderBy,
  query,
  QueryConstraint,
  QueryDocumentSnapshot,
  startAfter,
  where,
} from 'firebase/firestore'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'

import { Filter, NewsCard, Pagination, Result } from 'components'
import { PAGE_LIMIT } from 'constants/common'
import { RETRY_ERROR } from 'constants/message'
import { EHouseType } from 'enums'
import { db } from 'libs/firebase'

const initialFilter: AddressFilter = {
  ward: undefined,
  district: undefined,
  province: undefined,
}

export default function NewsList() {
  const { pathname } = useLocation()
  const [newsList, setNewsList] = useState<IProperty[]>([])
  const [fetched, setFetched] = useState(false)
  const [docPair, setDocPair] = useState<
    [QueryDocumentSnapshot<DocumentData>, QueryDocumentSnapshot<DocumentData>]
  >([null, null])
  const [loading, setLoading] = useState(false)
  const [constraint, setConstraint] = useState<QueryConstraint[]>([])
  const [filter, setFilter] = useState<AddressFilter>(initialFilter)

  const releaseState = () => {
    setNewsList([])
    setDocPair([null, null])
    setFetched(false)
    setConstraint([])
    setFilter(initialFilter)
  }

  const fetchData = useCallback(
    async (...constraints: QueryConstraint[]) => {
      setLoading(true)
      const houseTypeArr = pathname.startsWith('/nha-dat')
        ? [EHouseType.apartment, EHouseType.house, EHouseType.land]
        : [EHouseType.businessTransfer]
      try {
        const docsRef = collection(db, 'properties')
        const q = query(
          docsRef,
          where('type', 'in', houseTypeArr),
          where('published', '==', true),
          orderBy('createdAt', 'desc'),
          limit(PAGE_LIMIT),
          ...constraints,
          ...constraint,
        )

        const snapshot = await getDocs(q)
        snapshot.docs?.length &&
          setDocPair([
            snapshot.docs[0],
            snapshot.docs[snapshot.docs.length - 1],
          ])

        const newsList: IProperty[] = []
        snapshot.forEach((doc) => {
          newsList.push({
            id: doc.id,
            ...doc.data(),
          } as any)
        })
        setNewsList(newsList)
      } catch (e) {
        toast.error(RETRY_ERROR)
      } finally {
        setLoading(false)
        setFetched(true)
      }
    },
    [pathname, constraint],
  )

  const handleFilter = useCallback((v: AddressFilter) => {
    setFilter(v)
    if (Object.entries(v).every(([, v]) => !v)) setConstraint([])
    if (v.ward) {
      setConstraint([where('ward', '==', v.ward)])
      return
    }

    if (v.district) {
      setConstraint([where('district', '==', v.district)])
      return
    }

    if (v.province) {
      setConstraint([where('province', '==', v.province)])
      return
    }
  }, [])

  const handleClearFilter = useCallback(() => {
    if (Object.entries(filter).some(([, v]) => !!v)) {
      setFilter(initialFilter)
      setConstraint([])
    }
  }, [filter])

  const handleChangePage = useCallback(
    async (next: boolean = false) => {
      const [first, last] = docPair
      let constraint: QueryConstraint
      if (next) {
        if (last) constraint = startAfter(last)
      } else {
        if (first) constraint = endBefore(first)
      }
      constraint && fetchData(constraint)
    },
    [docPair, fetchData],
  )

  useEffect(() => {
    setFetched(false)
  }, [constraint, pathname])

  // First run
  useEffect(() => {
    !fetched && fetchData()
  }, [fetched])

  useEffect(() => {
    return () => {
      releaseState()
    }
  }, [pathname])

  if (loading) return <Result title="Đang lấy thông tin..." />

  return (
    <div className="p-5 flex items-center flex-col">
      <Filter
        value={filter}
        onFilter={handleFilter}
        onClear={handleClearFilter}
      />
      {!newsList.length && <Result title="Không có thông tin" />}
      <div className="max-w-[1000px] w-full">
        {newsList.map((x) => (
          <NewsCard className="h-[150px]" key={x.id} data={x} />
        ))}
      </div>
      <Pagination
        hideNavigation={!newsList.length}
        onFirst={() => fetchData()}
        onPrev={() => handleChangePage()}
        onNext={() => handleChangePage(true)}
      />
    </div>
  )
}
