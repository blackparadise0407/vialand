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
    image: string
  }

  interface IAddress {
    province: number
    district: number
    ward: number
    address: string
  }
}
export {}
