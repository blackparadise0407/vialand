import { EAction } from 'enums'
import request from './request'

const BASE_URL = process.env.REACT_APP_BASE_API
const NEWS_API = BASE_URL + '/news'

export interface IGetNewsQuery extends ICommonQuery {
  ward?: number
  province?: number
  district?: number
  published?: boolean
  action?: EAction
}

export const getNews = (queries: IGetNewsQuery) => {
  return request<
    IAppResponse<{
      news: IProperty[]
      total: number
      page: number
      limit: number
    }>
  >('GET', NEWS_API, queries)
}
