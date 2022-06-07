import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'

import { getNews } from 'apis'
import { Filter, NewsCard, Pagination, Result } from 'components'
import { PAGE_LIMIT } from 'constants/common'
import { RETRY_ERROR } from 'constants/message'
import { EAction } from 'enums'
import { useQueryParams } from 'hooks/useQueryParams'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

export default function NewsList() {
  const { pathname, search } = useLocation()
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
  const [query, updateQuery] = useQueryParams<
    AddressFilter & Omit<ICommonQuery, 'limit'>
  >()

  const releaseState = () => {
    setState({
      data: [],
      limit: PAGE_LIMIT,
      total: 0,
      fetched: false,
    })
  }

  const handlePageChange = useCallback((page: number) => {
    updateQuery({ page })
  }, [])

  const handleChangeFilter = useCallback((v: AddressFilter) => {
    updateQuery({ page: 1, ...v })
  }, [])

  const handleClearFilter = useCallback(() => {
    updateQuery({
      page: 1,
    })
  }, [])

  useEffect(() => {
    async function eff() {
      setLoading(true)
      const { limit } = state
      const action = pathname.startsWith('/mua-ban')
        ? EAction.trade
        : EAction.rent
      const { data, status } = await getNews({
        ...query,
        limit,
        published: true,
        action,
      })
      if (status === 200) {
        const { news, total } = data
        setState((prev) => ({ ...prev, data: news, total, fetched: true }))
      } else {
        toast.error(RETRY_ERROR)
        setState((prev) => ({ ...prev, fetched: true }))
      }
      setLoading(false)
    }
    !state.fetched && eff()
  }, [state.fetched])

  useEffect(() => {
    setState((prev) => ({ ...prev, fetched: false }))
  }, [search])

  useEffect(() => {
    const page = query.page ?? 1
    updateQuery({
      ...query,
      page,
    })

    return () => {
      releaseState()
    }
  }, [pathname])

  const { province, district, ward } = query

  return (
    <div className="p-5 flex items-center flex-col">
      <Filter
        value={{ province, district, ward }}
        onFilter={handleChangeFilter}
        onClear={handleClearFilter}
      />
      {!loading && !state.data.length && <Result title="Không có thông tin" />}
      <div className="max-w-[1000px] w-full">
        {loading ? (
          <Result
            title={
              <div className="flex items-center gap-2">
                <AiOutlineLoading3Quarters className="animate-spin" /> Đang lấy
                thông tin...
              </div>
            }
          />
        ) : (
          <>
            {state.data.map((x) => (
              <NewsCard key={x.id} data={x} />
            ))}
          </>
        )}
      </div>
      <Pagination
        total={state.total}
        page={parseInt(query.page as any, 10)}
        limit={state.limit}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
