import { EPropertyDirection, EHouseType, EAction } from 'enums'

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
    images: IKeyValue[]
    createdAt: number
    province: number
    ward: number
    district: number
    provinceName: string
    wardName: string
    districtName: string
    slug: string
    video: IKeyValue
    paymentImage: IKeyValue
    hideVideo: boolean
    published: boolean
    price: number
    length: number
    width: number
    action: EAction
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

  interface IAuthContext {
    isAuth: boolean
    token: string
    onLogin: (pwd: string) => void
    onOpenSignIn: () => void
  }

  interface IPagination {
    page?: number
    pageSize?: number
    total?: number
  }

  interface IKeyValue {
    id: string
    value: any
    [key: string]: any
  }

  type PickerTypeKey = 'images' | 'video' | 'paymentImage' | undefined

  interface IGoogleDocsResponse {
    id: string
    embedLink: string
    thumbnailLink: string
    webViewLink: string
  }

  type AddressFilter = Omit<IAddress, 'address'>
}
export {}
