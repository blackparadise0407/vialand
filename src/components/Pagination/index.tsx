import { memo, useCallback } from 'react'
import clsx from 'clsx'
import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi'

import { DOTS, usePagination } from './usePagination'

type PaginationProps = {
  total?: number
  page?: number
  limit?: number
  onPageChange?: (page: number) => void
}

export default memo(function Pagination({
  total = 0,
  page = 1,
  limit = 5,
  onPageChange = () => {},
}: PaginationProps) {
  const paginationRange = usePagination({
    currentPage: page,
    totalCount: total,
    siblingCount: 1,
    pageSize: limit,
  })

  const handleChangeNextPage = () => {
    onPageChange(page + 1)
  }

  const handleChangePrevPage = () => {
    onPageChange(page - 1)
  }

  const handleChangePage = useCallback(
    (_page: number) => {
      if (_page === page) return
      onPageChange(_page)
    },
    [page, onPageChange],
  )

  const totalPage = Math.floor(total / limit)
  const hasOnePage = total <= limit

  return (
    <div className="flex my-3 space-x-2">
      {totalPage > 0 && (
        <>
          {!hasOnePage && (
            <button
              title="Trang trước"
              className={clsx(
                'flex items-center justify-center w-[30px] h-[30px] px-2 py-1 bg-[#111] hover:bg-opacity-70 border border-transparent transition-colors text-white rounded',
                page === 1 && 'pointer-events-none bg-[#aeaeae]',
              )}
              onClick={handleChangePrevPage}
            >
              <HiChevronDoubleLeft />
            </button>
          )}

          {paginationRange?.map((x, idx) => {
            if (x === DOTS)
              return (
                <div
                  key={idx + 'dots'}
                  className="w-[30px] h-[30px] text-center flex items-end justify-center"
                >
                  ...
                </div>
              )
            return (
              <button
                title={`Trang ${x}`}
                key={x}
                className={clsx(
                  'flex items-center justify-center w-[30px] h-[30px] px-2 py-1 hover:bg-opacity-70 border transition-colors rounded',
                  page === x
                    ? 'text-[#111] bg-white border-[#111]'
                    : 'bg-[#111] text-white  border-transparent',
                )}
                onClick={() => handleChangePage(x as number)}
              >
                <span>{x}</span>
              </button>
            )
          })}
          {!hasOnePage && (
            <button
              title="Trang sau"
              className={clsx(
                'flex items-center justify-center w-[30px] h-[30px] px-2 py-1 bg-[#111] hover:bg-opacity-70 border border-transparent transition-colors text-white rounded',
                page > totalPage && 'pointer-events-none bg-[#aeaeae]',
              )}
              onClick={handleChangeNextPage}
            >
              <HiChevronDoubleRight />
            </button>
          )}
        </>
      )}
    </div>
  )
})
