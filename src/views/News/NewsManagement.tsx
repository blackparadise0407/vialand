import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react'
import dayjs from 'dayjs'
import {
  AiOutlineClose,
  AiOutlineHome,
  AiOutlineReload,
  AiOutlineSearch,
  AiOutlineSync,
} from 'react-icons/ai'
import { deleteDoc, doc, setDoc } from 'firebase/firestore'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { placeholder } from 'assets/images'
import { getNews, renewToken } from 'apis'
import { CrudButton, Pagination } from 'components'
import { PAGE_LIMIT } from 'constants/common'
import { RETRY_ERROR } from 'constants/message'
import { useAuthContext } from 'contexts/AuthContext'
import { useQueryParams } from 'hooks/useQueryParams'
import { db } from 'libs/firebase'
import { removeFileFromDriveById, removeNewsAssets } from 'libs/google'

export default function NewsManagement() {
  const navigate = useNavigate()
  const { search } = useLocation()
  const { token, onLogout } = useAuthContext()
  const [query, updateQuery] = useQueryParams<{ slug: string; page: number }>()

  const [loading, setLoading] = useState(false)
  const [state, setState] = useState<{
    data: IProperty[]
    limit: number
    total: number
    fetched: boolean
  }>({
    data: [],
    limit: PAGE_LIMIT,
    total: 0,
    fetched: false,
  })

  const inputRef = useRef<HTMLInputElement>(null)

  const handleToggleProperties = useCallback(
    async (id: string, prop: keyof IProperty) => {
      const clone = [...state.data]
      const foundNewsIdx = clone.findIndex((x) => x.id === id)
      if (foundNewsIdx > -1) {
        ;(clone[foundNewsIdx][prop] as boolean) = !clone[foundNewsIdx][prop]
        setState((prev) => ({ ...prev, data: clone }))
        try {
          const docRef = doc(db, 'properties', id)
          await setDoc(docRef, clone[foundNewsIdx])
          toast.success('Thao tác thành công')
        } catch (e) {
          ;(clone[foundNewsIdx][prop] as boolean) = !clone[foundNewsIdx][prop]
          setState((prev) => ({ ...prev, data: clone }))
        }
      }
    },
    [state.data],
  )

  const handleDeleteNews = useCallback(
    async (id: string) => {
      const clone = [...state.data]
      const foundNewsIdx = clone.findIndex((x) => x.id === id)
      if (foundNewsIdx > -1) {
        const docRef = doc(db, 'properties', id)
        const promises = Promise.all(
          [deleteDoc(docRef)].concat(
            removeNewsAssets(clone[foundNewsIdx], token),
          ),
        )
        await toast.promise(promises, {
          pending: 'Đang xóa bài đăng',
          success: 'Xóa bài đăng thành công',
          error: RETRY_ERROR,
        })
        setState((prev) => ({ ...prev, fetched: false }))
      }
    },
    [state.data, token],
  )

  const handleDeleteNewsVideo = useCallback(
    async (newsId: string, fileId: string) => {
      const clone = [...state.data]
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
          setState((prev) => ({ ...prev, data: clone }))
        } catch (e) {
          setState((prev) => ({ ...prev }))
        }
      }
    },
    [token, state.data],
  )

  const handlePageChange = useCallback(
    (nextPage: number) => {
      updateQuery({ ...query, page: nextPage })
    },
    [query, updateQuery],
  )

  const skip = (query.page - 1) * state.limit

  const handleSearchById = (e: MouseEvent<HTMLButtonElement>) => {
    if (inputRef.current.value) {
      updateQuery({
        ...query,
        slug: inputRef.current.value,
      })
    } else {
      updateQuery({
        page: query.page,
      })
    }
  }

  const handleClearSearch = () => {
    updateQuery({
      page: query.page,
    })
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const handleRenew = async () => {
    try {
      const { data, status } = await renewToken()
      if (status === 200) {
        window.open(
          data,
          '_blank',
          'resizable=yes,top=200,left=200,width=480,height=640',
        )
      }
    } catch (e) {}
  }

  const handleRefresh = () => {
    setState((prev) => ({ ...prev, fetched: false }))
  }

  // First run
  useEffect(() => {
    async function eff() {
      setLoading(true)
      const { limit } = state
      const { data, status } = await getNews({
        ...query,
        limit,
      })
      if (status === 200) {
        setState((prev) => ({
          ...prev,
          data: data.news,
          limit: data.limit,
          total: data.total,
          fetched: true,
        }))
      } else {
        toast.error(RETRY_ERROR)
        setState((prev) => ({
          ...prev,
          fetched: true,
        }))
      }
      setLoading(false)
    }
    !state.fetched && eff()
  }, [state.fetched])

  useEffect(() => {
    const page = query.page ?? 1
    updateQuery({
      ...query,
      page,
    })
  }, [])

  useEffect(() => {
    setState((prev) => ({ ...prev, fetched: false }))
  }, [search])

  useEffect(() => {
    if (query.slug) inputRef.current.value = query.slug
  }, [query.slug])

  useEffect(() => {
    return () => {
      onLogout()
    }
  }, [])

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
          <button onClick={handleClearSearch} className="btn btn--secondary">
            <AiOutlineClose />
            <span>Xóa</span>
          </button>
          <div className="flex-grow"></div>
          <button onClick={handleRefresh} className="btn">
            <AiOutlineReload />
            <span>Refresh</span>
          </button>
          <button onClick={() => navigate('/')} className="btn btn--secondary">
            <AiOutlineHome />
            <span>Về trang chủ</span>
          </button>
          <button onClick={handleRenew} className="btn">
            <AiOutlineSync />
            <span>Làm mới token</span>
          </button>
        </div>
        <table className="table-auto w-full min-w-[1024px] overflow-y-auto">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên</th>
              <th>Ngày đăng</th>
              <th>Ảnh thanh toán</th>
              <th>Link video</th>
              <th>Thao tác video</th>
              <th>Thao tác bài đăng</th>
            </tr>
          </thead>
          <tbody>
            {!state.data.length ? (
              <tr className="text-center">
                <td colSpan={100}>
                  {loading ? 'Loading...' : 'Không có data'}
                </td>
              </tr>
            ) : (
              <>
                {state.data.map(
                  (
                    {
                      id,
                      subject,
                      video,
                      createdAt,
                      hideVideo,
                      published,
                      paymentImage,
                    },
                    idx,
                  ) => (
                    <tr className="hover:bg-gray-100 cursor-default" key={id}>
                      <td>{skip + idx + 1}</td>
                      <td>{subject}</td>
                      <td>
                        {dayjs(createdAt * 1000).format('DD/MM/YYYY - HH:mm')}
                      </td>
                      <td>
                        {paymentImage ? (
                          <div className="relative aspect-sqr">
                            <iframe
                              className="absolute top-0 left-0 w-full h-full"
                              title="paymentImage"
                              scrolling="no"
                              src={paymentImage.value}
                            ></iframe>
                          </div>
                        ) : (
                          // <img
                          //   className="w-[192px] overflow-hidden border mx-auto"
                          //   src={`https://lh3.googleusercontent.com/d/${paymentImage.id}`}
                          //   alt=""
                          //   onError={(e) => {
                          //     e.currentTarget.onerror = null
                          //     e.currentTarget.src = placeholder
                          //   }}
                          // />
                          '---'
                        )}
                      </td>
                      <td>
                        {video ? (
                          <div className="relative w-[192px] aspect-video">
                            <iframe
                              className="absolute top-0 left-0 w-full h-full"
                              title="video"
                              scrolling="no"
                              src={video.value}
                            ></iframe>
                          </div>
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
          total={state.total}
          page={parseInt(query.page as any, 10)}
          limit={state.limit}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}
