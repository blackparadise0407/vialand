import clsx from 'clsx'
import { memo } from 'react'
import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi'

type PaginationProps = {
  reachStart?: boolean
  reachEnd?: boolean
  onFirst?: () => void
  onNext?: () => void
  onPrev?: () => void
}

export default memo(function Pagination({
  reachStart = false,
  reachEnd = false,
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
      <button
        className={clsx(
          'flex items-center justify-center px-2 py-1 bg-[#111] hover:bg-opacity-70 transition-colors text-white rounded',
          reachStart && 'pointer-events-none bg-gray-400',
        )}
        disabled={reachStart}
        onClick={onPrev}
      >
        <HiChevronDoubleLeft />
        <span>Trước</span>
      </button>
      <button
        className={clsx(
          'flex items-center justify-center px-2 py-1 bg-[#111] hover:bg-opacity-70 transition-colors text-white rounded',
          reachEnd && 'pointer-events-none bg-gray-400',
        )}
        disabled={reachEnd}
        onClick={onNext}
      >
        <span>Sau</span>
        <HiChevronDoubleRight />
      </button>
    </div>
  )
})
