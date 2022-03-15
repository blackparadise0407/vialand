import { EHouseType } from 'enums'

export const PropertyTypeOptions = [
  {
    name: 'Nhà ở',
    value: EHouseType.house,
  },
  {
    name: 'Đất',
    value: EHouseType.land,
  },
  {
    name: 'Căn hộ chung cư',
    value: EHouseType.apartment,
  },
  {
    name: 'Mặt bằng, sang nhượng kinh doanh',
    value: EHouseType.businessTransfer,
  },
]
