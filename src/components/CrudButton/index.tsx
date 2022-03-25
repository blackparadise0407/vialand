import clsx from 'clsx'
import { memo } from 'react'
import { AiFillDelete, AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'

type CrudButtonProps = {
  booleanVal?: boolean
  className?: string
  hideToggle?: boolean
  disableDelete?: boolean
  onToggle?: () => void
  onDelete?: () => void
}

export default memo(function CrudButton({
  booleanVal = true,
  className = '',
  hideToggle = false,
  disableDelete = false,
  onToggle = () => {},
  onDelete = () => {},
}: CrudButtonProps) {
  const handleDelete = () => {
    !disableDelete && onDelete()
  }
  return (
    <div
      className={clsx(
        'flex items-center justify-evenly text-sm md:text-lg gap-1',
        className,
      )}
    >
      {!hideToggle ? (
        <>
          {booleanVal ? (
            <div
              className="flex items-center gap-1 justify-center rounded text-white bg-blue-500 p-2 cursor-pointer hover:shadow hover:bg-blue-400 transition-all"
              onClick={onToggle}
            >
              <AiFillEye className="" />
              <span className="text-sm">Hiện</span>
            </div>
          ) : (
            <div
              className="flex items-center gap-1 justify-center rounded text-white bg-blue-500 p-2 cursor-pointer hover:shadow hover:bg-blue-400 transition-all"
              onClick={onToggle}
            >
              <AiFillEyeInvisible className="" />
              <span className="text-sm">Ẩn</span>
            </div>
          )}
        </>
      ) : null}

      <div
        className={clsx(
          'flex items-center gap-1 justify-center rounded p-2 cursor-pointer hover:shadow hover:bg-red-400 transition-all',
          disableDelete
            ? 'pointer-events-none cursor-not-allowed bg-gray-400 text-gray-50'
            : 'text-white bg-red-500',
        )}
        onClick={handleDelete}
      >
        <AiFillDelete className="" />
        <span className="text-sm">Xóa</span>
      </div>
    </div>
  )
})
