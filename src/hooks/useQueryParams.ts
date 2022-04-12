import { useCallback, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import qs from 'query-string'

export function useQueryParams<T>(): [T, (updateParams: Partial<T>) => void] {
  const { pathname, search } = useLocation()
  const navigate = useNavigate()

  const params = useMemo(() => qs.parse(search) as unknown as T, [search])

  const updateQuery = useCallback(
    (updateParams: Partial<T>): void => {
      navigate(pathname + '?' + qs.stringify(updateParams), {
        replace: true,
      })
    },
    [pathname, navigate],
  )

  return [params, updateQuery]
}
