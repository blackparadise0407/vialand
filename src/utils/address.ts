import wards from 'constants/wards.json'
import provinces from 'constants/provinces.json'
import districts from 'constants/districts.json'

export const mapAddressData = (address: IAddress) => {
  const { province, ward, district } = address
  const foundProvince = provinces.find((x) => parseInt(x.id, 10) === province)
  const foundDistrict = districts.find((x) => parseInt(x.id, 10) === district)
  const foundWard = wards.find((x) => parseInt(x.id, 10) === ward)

  const districtName = `${foundDistrict.typeName} ${
    foundDistrict.name.startsWith('Quận')
      ? foundDistrict.name.substring(5)
      : foundDistrict.name
  }`

  return {
    ...address,
    provinceName: `${foundProvince.typeName} ${foundProvince?.name}`,
    districtName,
    wardName: foundWard?.name,
  }
}
