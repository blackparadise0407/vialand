import { ChangeEvent, memo, useEffect, useMemo, useState } from 'react'

import wards from 'constants/wards.json'
import provinces from 'constants/provinces.json'
import districts from 'constants/districts.json'

type AddressSelectProps = {
  value?: IAddress
  onChange?: (v: IAddress) => void
}

export const initialAddressSelectValue: IAddress = {
  ward: undefined,
  district: undefined,
  province: undefined,
  address: '',
}

export default memo(function AddressSelect({
  value,
  onChange,
}: AddressSelectProps) {
  const [innerVal, setInnerVal] = useState<IAddress>(
    value ?? initialAddressSelectValue,
  )

  const districtOpts = useMemo(() => {
    return districts.filter(
      (x) => parseInt(x.parentId, 10) === innerVal.province,
    )
  }, [innerVal.province])

  const wardOpts = useMemo(() => {
    return wards.filter((x) => parseInt(x.parentId, 10) === innerVal.district)
  }, [innerVal.district])

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const val = !isNaN(e.target.value as any)
      ? parseInt(e.target.value, 10)
      : undefined
    const evtName = e.target.name

    setInnerVal((prev) => {
      const state = { ...prev } as any
      switch (evtName) {
        case 'province':
          state.district = undefined
          state.ward = undefined
          break
        case 'district':
          state.ward = undefined
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
          <option value={undefined}>Chọn tỉnh / thành phố</option>
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
          <option value={undefined}>Chọn quận / huyện</option>
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
          <option value={undefined}>Chọn phường / xã</option>
          {wardOpts.map(({ id, name, typeName }) => (
            <option key={id} value={id}>
              {typeName} {name}
            </option>
          ))}
        </select>
      </div>
      <input
        className="input"
        placeholder="Nhập địa chỉ..."
        onChange={handleInputChange}
      />
    </div>
  )
})
