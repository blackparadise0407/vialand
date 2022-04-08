import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import qs from 'query-string'

import { getNews } from 'apis'
import { Filter, NewsCard, Pagination, Result } from 'components'
import { PAGE_LIMIT } from 'constants/common'
import { RETRY_ERROR } from 'constants/message'
import { EAction } from 'enums'

const _writeToUrl = (originPath: string, obj: any) => {
  window.history.replaceState(null, null, originPath + '?' + qs.stringify(obj))
}

const getInitialFilterFromUrl = () => {
  const filter = {}
  const query = qs.parse(window.location.search)
  Object.entries(query).forEach(([key, val]) => {
    switch (key) {
      case 'ward':
      case 'province':
      case 'district':
        ;(filter as any)[key] = !!val ? parseInt(val as any, 10) : undefined
        break
      default:
        break
    }
  })
  return filter as AddressFilter
}

const initialFilter: AddressFilter = {
  district: undefined,
  ward: undefined,
  province: undefined,
}

export default function NewsList() {
  const { pathname, search } = useLocation()
  const [loading, setLoading] = useState(false)
  const [state, setState] = useState<{
    data: IProperty[]
    filter: AddressFilter
    page: number
    limit: number
    total: number
    fetched: boolean
  }>({
    data: [],
    filter: getInitialFilterFromUrl(),
    page: 1,
    limit: PAGE_LIMIT,
    total: 0,
    fetched: false,
  })

  const releaseState = () => {
    setState({
      data: [],
      filter: initialFilter,
      page: 1,
      limit: PAGE_LIMIT,
      total: 0,
      fetched: false,
    })
  }

  const handlePageChange = useCallback(
    (page: number) => {
      setState((prev) => ({ ...prev, page }))
      _writeToUrl(pathname, { page, ...state.filter })
    },
    [pathname, state.filter],
  )

  const handleChangeFilter = useCallback(
    (v: AddressFilter) => {
      setState((prev) => ({ ...prev, filter: v }))
      _writeToUrl(pathname, { page: state.page, ...v })
    },
    [pathname, state.page],
  )

  const handleClearFilter = useCallback(() => {
    setState((prev) => ({ ...prev, filter: initialFilter }))
    _writeToUrl(pathname, { page: state.page })
  }, [pathname, state.page])

  useEffect(() => {
    const filter = {}
    const q: any = {}
    const query = qs.parse(search)
    Object.entries(query).forEach(([key, val]) => {
      switch (key) {
        case 'ward':
        case 'province':
        case 'district':
          ;(filter as any)[key] = parseInt(val as any, 10)
          break
        case 'page':
          q['page'] = val
          break
        case 'limit':
          q['limit'] = val
          break
        default:
          break
      }
    })
    setState((prev) => ({ ...prev, filter: filter as AddressFilter }))
  }, [pathname, search])

  useEffect(() => {
    setState((prev) => ({ ...prev, fetched: false }))
  }, [state.filter, state.page])

  useEffect(() => {
    async function eff() {
      setLoading(true)
      const { limit, page, filter } = state
      const action = pathname.startsWith('/mua-ban')
        ? EAction.trade
        : EAction.rent
      const { data, status } = await getNews({
        ...filter,
        limit,
        page,
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
  }, [state.fetched, pathname])

  useEffect(() => {
    return () => {
      releaseState()
    }
  }, [pathname])

  return (
    <div className="p-5 flex items-center flex-col">
      <Filter
        value={state.filter}
        onFilter={handleChangeFilter}
        onClear={handleClearFilter}
      />
      {!loading && !state.data.length && <Result title="Không có thông tin" />}
      <div className="max-w-[1000px] w-full">
        {loading ? (
          <Result title="Đang lấy thông tin..." />
        ) : (
          <>
            {state.data.map((x) => (
              <NewsCard className="min-h-[150px]" key={x.id} data={x} />
            ))}
          </>
        )}
      </div>
      <Pagination
        total={state.total}
        page={state.page}
        limit={state.limit}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
