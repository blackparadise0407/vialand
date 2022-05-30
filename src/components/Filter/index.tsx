import { ChangeEvent, memo, useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import { AiOutlineClose, AiOutlineSearch } from 'react-icons/ai'

import wards from 'constants/wards.json'
import provinces from 'constants/provinces.json'
import districts from 'constants/districts.json'

type FilterProps = {
  className?: string
  value?: AddressFilter
  onFilter?: (v: AddressFilter) => void
  onClear?: () => void
}

export default memo(function Filter({
  value = {
    district: '',
    ward: '',
    province: '',
  },
  onFilter = () => {},
  onClear = () => {},
}: FilterProps) {
  const [innerVal, setInnerVal] = useState<AddressFilter>(value)

  const disabledFilter = useMemo(
    () => Object.entries(innerVal).every(([, v]) => !v),
    [innerVal],
  )

  const districtOpts = useMemo(() => {
    return districts.filter((x) => x.parentId === innerVal.province?.toString())
  }, [innerVal.province])

  const wardOpts = useMemo(() => {
    return wards.filter((x) => x.parentId === innerVal.district?.toString())
  }, [innerVal.district])

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const val = !isNaN((e.target.value as any) || undefined)
      ? parseInt(e.target.value, 10)
      : ''
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

  const handleFilter = () => {
    if (!Object.entries(innerVal).every(([, v]) => !v)) {
      onFilter(innerVal)
    }
  }

  useEffect(() => {
    if (value.province === undefined) value.province = ''
    setInnerVal(value)
  }, [value])

  return (
    <div
      className="grid max-w-full gap-5 my-5"
      style={{
        gridTemplateColumns: 'repeat(auto-fit, minmax(20rem, 4fr))',
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
      {!!innerVal.province && (
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
      )}
      {!!innerVal.district && (
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
      )}
      <div className="flex gap-2 ">
        <button
          className={clsx(
            'btn justify-self-center',
            disabledFilter && 'btn--disabled',
          )}
          onClick={handleFilter}
        >
          <AiOutlineSearch />
          <span>Tìm kiếm</span>
        </button>
        <button className="btn justify-self-center" onClick={onClear}>
          <AiOutlineClose />
          <span>Xóa bộ lọc</span>
        </button>
      </div>
    </div>
  )
})
