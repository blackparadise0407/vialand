import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  endBefore,
  getDocs,
  limit,
  orderBy,
  query,
  QueryConstraint,
  QueryDocumentSnapshot,
  setDoc,
  startAfter,
  where,
} from 'firebase/firestore'

import { CrudButton, Pagination } from 'components'
import { PAGE_LIMIT } from 'constants/common'
import { RETRY_ERROR } from 'constants/message'
import { useAuthContext } from 'contexts/AuthContext'
import { useQueryParams } from 'hooks/useQueryParams'
import { db } from 'libs/firebase'
import { removeFileFromDriveById } from 'libs/google'

export default function NewsManagement() {
  const { token } = useAuthContext()
  const { slug } = useQueryParams<{ slug: string }>()

  const [docPair, setDocPair] = useState<
    [QueryDocumentSnapshot<DocumentData>, QueryDocumentSnapshot<DocumentData>]
  >([null, null])
  const [newsList, setNewsList] = useState<IProperty[]>([])
  const [loading, setLoading] = useState(false)
  const [constraint, setConstraint] = useState<QueryConstraint[]>([])
  const [fetched, setFetched] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  const handleToggleProperties = useCallback(
    async (id: string, prop: keyof IProperty) => {
      const clone = [...newsList]
      const foundNewsIdx = clone.findIndex((x) => x.id === id)
      if (foundNewsIdx > -1) {
        ;(clone[foundNewsIdx][prop] as boolean) = !clone[foundNewsIdx][prop]
        setNewsList(clone)
        try {
          const docRef = doc(db, 'properties', id)
          await setDoc(docRef, clone[foundNewsIdx])
          toast.success('Thao tác thành công')
        } catch (e) {
          ;(clone[foundNewsIdx][prop] as boolean) = !clone[foundNewsIdx][prop]
          setNewsList(clone)
        }
      }
    },
    [newsList],
  )

  const handleDeleteNews = useCallback(
    async (id: string) => {
      const clone = [...newsList]
      const foundNewsIdx = clone.findIndex((x) => x.id === id)
      if (foundNewsIdx > -1) {
        const docRef = doc(db, 'properties', id)
        toast.promise(deleteDoc(docRef), {
          pending: 'Đang xóa bài đăng',
          success: 'Xóa bài đăng thành công',
          error: RETRY_ERROR,
        })
        clone.splice(foundNewsIdx, 1)
        setNewsList(clone)
      }
    },
    [newsList],
  )

  const handleDeleteNewsVideo = useCallback(
    async (newsId: string, fileId: string) => {
      const clone = [...newsList]
      const foundNewsIdx = clone.findIndex((x) => x.id === newsId)
      if (foundNewsIdx > -1) {
        try {
          clone[foundNewsIdx].video = null
          const docRef = doc(db, 'properties', newsId)
          await toast.promise(
            Promise.all([
              setDoc(docRef, clone[foundNewsIdx]),
              removeFileFromDriveById(fileId, token),
            ]),
            {
              pending: 'Đang xóa video',
              success: 'Xóa video thành công',
              error: RETRY_ERROR,
            },
          )
          setNewsList(clone)
        } catch (e) {
          setNewsList([...newsList])
        }
      }
    },
    [token, newsList],
  )

  const fetchData = useCallback(
    async (...constraints: QueryConstraint[]) => {
      setLoading(true)
      try {
        const docsRef = collection(db, 'properties')
        const q = query(
          docsRef,
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
        if (!newsList.length) {
          toast.warning('Đã hết data')
        } else setNewsList(newsList)
      } catch (e) {
        console.log(e)
        toast.error(RETRY_ERROR)
      } finally {
        setLoading(false)
        setFetched(true)
      }
    },
    [constraint],
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

  const handleSearchById = (e: MouseEvent<HTMLButtonElement>) => {
    if (inputRef.current.value) {
      setConstraint([where('slug', '==', inputRef.current.value)])
    } else setConstraint([])
  }

  // First run
  useEffect(() => {
    !fetched && fetchData()
  }, [fetched])

  useEffect(() => {
    setFetched(false)
  }, [constraint])

  useEffect(() => {
    if (slug) inputRef.current.value = slug
  }, [slug])

  return (
    <div className="min-h-screen p-5">
      <h1>Quản trị</h1>
      <div className="w-full">
        <div className="flex my-2 gap-2 flex-wrap">
          <input
            ref={inputRef}
            placeholder="Nhập ID cần tra cứu"
            type="text"
            className="input max-w-[400px] w-full"
          />
          <button onClick={handleSearchById} className="btn">
            <AiOutlineSearch />
            <span>Tra cứu</span>
          </button>
        </div>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Ngày đăng</th>
              <th>Ảnh thanh toán</th>
              <th>Link video</th>
              <th>Thao tác video</th>
              <th>Thao tác bài đăng</th>
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
                  ({
                    id,
                    subject,
                    video,
                    createdAt,
                    hideVideo,
                    published,
                    paymentImage,
                  }) => (
                    <tr className="hover:bg-gray-100 cursor-default" key={id}>
                      <td>{subject}</td>
                      <td>
                        {dayjs(createdAt * 1000).format('DD/MM/YYYY - HH:mm')}
                      </td>
                      <td>
                        {paymentImage ? (
                          <iframe
                            className="w-full overflow-hidden aspect-square border"
                            title="paymentImage"
                            scrolling="no"
                            src={paymentImage.value}
                          ></iframe>
                        ) : (
                          '---'
                        )}
                      </td>
                      <td>
                        {video ? (
                          <iframe
                            className="w-full overflow-hidden aspect-video border"
                            title="video"
                            scrolling="no"
                            src={video.value}
                          ></iframe>
                        ) : (
                          '---'
                        )}
                      </td>
                      <td>
                        {/* <input
                          type="checkbox"
                          checked={!hideVideo}
                          onChange={() =>
                            handleToggleProperties(id, 'hideVideo')
                          }
                        /> */}
                        <CrudButton
                          hideToggle
                          disableDelete={!video}
                          booleanVal={hideVideo}
                          onDelete={() => handleDeleteNewsVideo(id, video.id)}
                          onToggle={() =>
                            handleToggleProperties(id, 'hideVideo')
                          }
                        />
                      </td>
                      <td>
                        {/* <input
                          type="checkbox"
                          checked={published}
                          onChange={() =>
                            handleToggleProperties(id, 'published')
                          }
                        /> */}
                        <CrudButton
                          booleanVal={!published}
                          onDelete={() => handleDeleteNews(id)}
                          onToggle={() =>
                            handleToggleProperties(id, 'published')
                          }
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
          onFirst={() => {
            setConstraint([])
            fetchData()
          }}
          onPrev={() => handleChangePage()}
          onNext={() => handleChangePage(true)}
        />
      </div>
    </div>
  )
}
