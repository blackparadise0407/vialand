import { EPropertyDirection, EHouseType } from 'enums'

declare global {
  interface IKeyValue {
    [key: string]: any | IKeyValue
  }
  interface IProperty {
    id: string
    subject: string
    contactNumber: string
    contactName: string
    size: number
    direction: EPropertyDirection
    address: string
    houseType: EHouseType
    region: number
    regionName: string
    areaName: string
    structure: string
    architecture: string
    description: string
    images: string
    createdAt: number
    province: number
    ward: number
    district: number
    provinceName: string
    wardName: string
    districtName: string
    slug: string
    video: string
    hideVideo: boolean
  }

  interface IAddress {
    province: number
    district: number
    ward: number
    address: string
  }

  interface IFile extends File {
    id?: string
    src?: string
  }

  interface ICloudinaryResponse {
    asset_id: string
    secure_url: 'https://res.cloudinary.com/dig00csrc/image/upload/v1647100311/vialand/1647100310975.jpg'
    url: 'http://res.cloudinary.com/dig00csrc/image/upload/v1647100311/vialand/1647100310975.jpg'
    [key: string]: any
  }

  interface IAuthContext {
    isAuth: boolean
    onLogin: (pwd: string) => void
    onOpenSignIn: () => void
  }

  interface IPagination {
    page?: number
    pageSize?: number
    total?: number
  }
}
export {}
