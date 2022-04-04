import { ChangeEvent, memo, useMemo, useState } from 'react'

import wards from 'constants/wards.json'
import provinces from 'constants/provinces.json'
import districts from 'constants/districts.json'
import { AiOutlineClose, AiOutlineSearch } from 'react-icons/ai'
import clsx from 'clsx'

type FilterProps = {
  className?: string
  value?: AddressFilter
  onFilter?: (v: AddressFilter) => void
  onClear?: () => void
}

export default memo(function Filter({
  value,
  onFilter = () => {},
  onClear = () => {},
}: FilterProps) {
  const [innerVal, setInnerVal] = useState<AddressFilter>(
    value ?? {
      district: undefined,
      ward: undefined,
      province: undefined,
    },
  )

  const disabledFilter = useMemo(
    () => Object.entries(innerVal).every(([, v]) => !v),
    [innerVal],
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

  const handleFilter = () => {
    if (!Object.entries(innerVal).every(([, v]) => !v)) {
      onFilter(innerVal)
    }
  }

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
        <option value={undefined}>Chọn tỉnh / thành phố</option>
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
          <option value={undefined}>Chọn quận / huyện</option>
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
          <option value={undefined}>Chọn phường / xã</option>
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
