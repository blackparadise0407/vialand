import { EAction, EHouseType } from 'enums'

export const PropertyTypeOptions = [
  {
    name: 'house',
    value: EHouseType.house,
  },
  {
    name: 'land',
    value: EHouseType.land,
  },
  {
    name: 'apartment',
    value: EHouseType.apartment,
  },
  {
    name: 'villa',
    value: EHouseType.villa,
  },
  {
    name: 'resort',
    value: EHouseType.resort,
  },
  {
    name: 'factory',
    value: EHouseType.factory,
  },
  {
    name: 'plan',
    value: EHouseType.plan,
  },
]

export const PropertyActionOptions = [
  {
    name: 'trading',
    value: EAction.trade,
  },
  {
    name: 'rent',
    value: EAction.rent,
  },
]
