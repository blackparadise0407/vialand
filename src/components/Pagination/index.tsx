import { memo } from 'react'
import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi'

type PaginationProps = {
  hideNavigation?: boolean
  onFirst?: () => void
  onNext?: () => void
  onPrev?: () => void
}

export default memo(function Pagination({
  hideNavigation = false,
  onFirst = () => {},
  onNext = () => {},
  onPrev = () => {},
}: PaginationProps) {
  return (
    <div className="flex my-3 space-x-2">
      <button
        className="flex items-center justify-center px-2 py-1 bg-[#111] hover:bg-opacity-70 transition-colors text-white rounded"
        onClick={onFirst}
      >
        <span>Trang đầu</span>
      </button>
      <div className="grow"></div>
      {!hideNavigation && (
        <>
          <button
            className="flex items-center justify-center px-2 py-1 bg-[#111] hover:bg-opacity-70 transition-colors text-white rounded"
            onClick={onPrev}
          >
            <HiChevronDoubleLeft />
            <span>Trước</span>
          </button>
          <button
            className="flex items-center justify-center px-2 py-1 bg-[#111] hover:bg-opacity-70 transition-colors text-white rounded"
            onClick={onNext}
          >
            <span>Sau</span>
            <HiChevronDoubleRight />
          </button>
        </>
      )}
    </div>
  )
})
