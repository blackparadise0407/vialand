import { EAction } from 'enums'
import request from './request'

const BASE_URL = process.env.REACT_APP_BASE_API
const NEWS_API = BASE_URL + '/news'

export interface IGetNewsQuery extends ICommonQuery {
  ward?: string | number
  province?: string | number
  district?: string | number
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

export const renewToken = () => {
  return request<IAppResponse<string>>('GET', BASE_URL + '/renew')
}
