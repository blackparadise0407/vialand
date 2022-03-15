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

import { NewsCard, Pagination, Result } from 'components'
import { PAGE_LIMIT } from 'constants/common'
import { RETRY_ERROR } from 'constants/message'
import { EHouseType } from 'enums'
import { db } from 'libs/firebase'

export default function NewsList() {
  const { pathname } = useLocation()
  const [newsList, setNewsList] = useState<IProperty[]>([])
  const [docPair, setDocPair] = useState<
    [QueryDocumentSnapshot<DocumentData>, QueryDocumentSnapshot<DocumentData>]
  >([null, null])
  const [loading, setLoading] = useState(false)

  const releaseState = () => {
    setNewsList([])
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
          orderBy('createdAt', 'desc'),
          limit(PAGE_LIMIT),
          ...constraints,
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
        if (!newsList.length) {
          toast.warning('Đã hết data')
        } else setNewsList(newsList)
      } catch (e) {
        toast.error(RETRY_ERROR)
      } finally {
        setLoading(false)
      }
    },
    [pathname],
  )

  const handleChangePage = useCallback(
    async (next: boolean = false) => {
      const [first, last] = docPair
      let constraint: QueryConstraint
      if (next) {
        if (last) constraint = startAfter(last)
      } else {
        if (first) constraint = endBefore(first)
      }
      try {
        constraint && (await fetchData(constraint))
      } catch (e) {}
    },
    [docPair, fetchData],
  )

  // useEffect(() => {
  //   setLoading(true)
  //   const houseTypeArr = pathname.startsWith('/nha-dat')
  //     ? [EHouseType.apartment, EHouseType.house, EHouseType.land]
  //     : [EHouseType.businessTransfer]
  //   const q = query(
  //     collection(db, 'properties'),
  //     where('type', 'in', houseTypeArr),
  //     orderBy('createdAt', 'desc'),
  //     limit(10),
  //   )
  //   const unsub = onSnapshot(q, (querySnapshot) => {
  //     const properties: IProperty[] = []
  //     querySnapshot.forEach((doc) => {
  //       properties.push({
  //         id: doc.id,
  //         ...doc.data(),
  //       } as any)
  //     })
  //     setNewsList(properties)
  //     setLoading(false)
  //   })

  //   return () => {
  //     releaseState()
  //     unsub()
  //   }
  // }, [pathname])

  // First run
  useEffect(() => {
    fetchData()
    return () => {
      releaseState()
    }
  }, [pathname, fetchData])

  if (loading) return <Result title="Đang lấy thông tin..." />

  if (!newsList.length) return <Result title="Không có thông tin" />

  return (
    <div className="p-5 flex items-center flex-col">
      <div className="max-w-[1000px] w-full">
        {newsList.map((x) => (
          <NewsCard className="h-[150px]" key={x.id} data={x} />
        ))}
      </div>
      <Pagination
        onFirst={() => fetchData()}
        onPrev={() => handleChangePage()}
        onNext={() => handleChangePage(true)}
      />
    </div>
  )
}
