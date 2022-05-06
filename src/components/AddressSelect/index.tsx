import { ChangeEvent, memo, useEffect, useMemo, useState } from 'react'

import wards from 'constants/wards.json'
import provinces from 'constants/provinces.json'
import districts from 'constants/districts.json'

type AddressSelectProps = {
  value?: IAddress
  onChange?: (v: IAddress) => void
}

export const initialAddressSelectValue: IAddress = {
  ward: '',
  district: '',
  province: '',
  address: '',
}

export default memo(function AddressSelect({
  value = {
    ward: '',
    district: '',
    province: '',
    address: '',
  },
  onChange,
}: AddressSelectProps) {
  const [innerVal, setInnerVal] = useState<IAddress>(value)

  const districtOpts = useMemo(() => {
    return districts.filter((x) => x.parentId === innerVal.province?.toString())
  }, [innerVal.province])

  const wardOpts = useMemo(() => {
    return wards.filter((x) => x.parentId === innerVal.district?.toString())
  }, [innerVal.district])

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    let val: number | string = e.target.value

    if (!isNaN(e.target.value as any) && val !== '')
      val = parseInt(e.target.value, 10)

    const evtName = e.target.name

    setInnerVal((prev) => {
      const state = { ...prev } as any
      switch (evtName) {
        case 'province':
          state.district = ''
          state.ward = ''
          break
        case 'district':
          state.ward = ''
          break
        default:
          break
      }
      state[evtName] = val
      return state
    })
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInnerVal((prev) => ({ ...prev, address: e.target.value }))
  }

  useEffect(() => {
    onChange?.(innerVal)
  }, [innerVal])

  return (
    <div className="flex flex-col gap-5">
      <div
        className="grid w-full gap-5"
        style={{
          gridTemplateColumns: `repeat(auto-fit, minmax(10rem, 3fr))`,
        }}
      >
        <select
          className="select"
          name="province"
          value={innerVal.province}
          onChange={handleSelectChange}
        >
          <option value={''}>Chọn tỉnh / thành phố</option>
          {provinces.map(({ id, name, typeName }) => (
            <option key={id} value={id}>
              {typeName} {name}
            </option>
          ))}
        </select>
        <select
          className="select"
          name="district"
          value={innerVal.district}
          onChange={handleSelectChange}
        >
          <option value={''}>Chọn quận / huyện</option>
          {districtOpts.map(({ id, name, typeName }) => (
            <option key={id} value={id}>
              {typeName} {name.startsWith('Quận') ? name.substring(5) : name}
            </option>
          ))}
        </select>
        <select
          className="select"
          name="ward"
          value={innerVal.ward}
          onChange={handleSelectChange}
        >
          <option value={''}>Chọn phường / xã</option>
          {wardOpts.map(({ id, name, typeName }) => (
            <option key={id} value={id}>
              {typeName} {name}
            </option>
          ))}
        </select>
      </div>
      <input
        className="input"
        maxLength={50}
        placeholder="Số nhà, thôn, tổ, tên đường (<50 ký tự)"
        onChange={handleInputChange}
      />
    </div>
  )
})
