import qs from 'query-string'

type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE'

export default async function request<T>(
  method: Method,
  url: string,
  data?: any,
): Promise<T | undefined> {
  let config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      secret: process.env.REACT_APP_SECRET,
    },
  }
  let _url = url

  if (data) {
    if (method === 'GET') {
      const queries = qs.stringify(data)
      _url += '?' + queries
    } else config.body = JSON.stringify(data)
  }

  const response = await fetch(_url, config)
  if (response.ok) {
    return (await response.json()) as T
  }

  return undefined
}
