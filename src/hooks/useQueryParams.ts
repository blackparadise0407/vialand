import { useLocation } from 'react-router-dom'

export function useQueryParams<T>(): T {
  const { search } = useLocation()

  const entries = search.substring(1).split('&')
  return entries.reduce((res, curr) => {
    const [key, val] = curr.split('=')
    if (!res[key]) {
      res[key] = val
    }
    return res
  }, {} as any) as T
}
