import { RETRY_ERROR } from 'constants/message'
import dayjs from 'dayjs'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  limit,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
  orderBy,
  endBefore,
  QueryConstraint,
} from 'firebase/firestore'
import { db } from 'libs/firebase'
import { useState } from 'react'
import { useCallback } from 'react'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { Pagination } from 'components'

const PAGE_LIMIT = 10

export default function NewsManagement() {
  const [docPair, setDocPair] = useState<
    [QueryDocumentSnapshot<DocumentData>, QueryDocumentSnapshot<DocumentData>]
  >([null, null])

  const [newsList, setNewsList] = useState<IProperty[]>([])
  const [loading, setLoading] = useState(false)

  const handleHideNews = useCallback(
    async (id: string) => {
      const clone = [...newsList]
      const foundNewsIdx = clone.findIndex((x) => x.id === id)
      if (foundNewsIdx > -1) {
        clone[foundNewsIdx].hidden = !clone[foundNewsIdx].hidden
        setNewsList(clone)
        try {
          const docRef = doc(db, 'properties', id)
          await setDoc(docRef, clone[foundNewsIdx])
        } catch (e) {
          clone[foundNewsIdx].hidden = !clone[foundNewsIdx].hidden
          setNewsList(clone)
        }
      }
    },
    [newsList],
  )

  const fetchData = useCallback(async (...constraints: QueryConstraint[]) => {
    setLoading(true)
    try {
      const docsRef = collection(db, 'properties')
      const q = query(
        docsRef,
        orderBy('createdAt', 'desc'),
        limit(PAGE_LIMIT),
        ...constraints,
      )
      const snapshot = await getDocs(q)
      snapshot.docs?.length &&
        setDocPair([snapshot.docs[0], snapshot.docs[snapshot.docs.length - 1]])

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
  }, [])

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

  // First run
  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="min-h-screen p-5">
      <div className="w-full">
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên</th>
              <th>Ngày đăng</th>
              <th>Link video</th>
              <th>Hiện tin</th>
            </tr>
          </thead>
          <tbody>
            {!newsList.length ? (
              <tr className="text-center">
                <td colSpan={100}>
                  {loading ? 'Loading...' : 'Không có data'}
                </td>
              </tr>
            ) : (
              <>
                {newsList.map(
                  ({ id, subject, video, createdAt, hidden }, idx) => (
                    <tr className="hover:bg-gray-100 cursor-default" key={id}>
                      <td>{idx + 1}</td>
                      <td>{subject}</td>
                      <td>
                        {dayjs(createdAt * 1000).format('DD/MM/YYYY - HH:mm')}
                      </td>
                      <td>{video || '---'}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={!hidden}
                          onChange={() => handleHideNews(id)}
                        />
                      </td>
                    </tr>
                  ),
                )}
              </>
            )}
          </tbody>
        </table>
        <Pagination
          onFirst={() => fetchData()}
          onPrev={() => handleChangePage()}
          onNext={() => handleChangePage(true)}
        />
      </div>
    </div>
  )
}
