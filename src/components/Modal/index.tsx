import { memo, ReactNode } from 'react'

import { Backdrop } from 'components'
import { AiOutlineClose } from 'react-icons/ai'

type ModalProps = {
  open?: boolean
  title?: string
  children?: ReactNode
  onClose?: () => void
}

export default memo(function Modal({
  open = false,
  title = '',
  children,
  onClose = () => {},
}: ModalProps) {
  if (!open) return null

  return (
    <Backdrop>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded min-w-[200px] w-full max-w-[500px] bg-white">
        <div className="flex p-4">
          <h1 className="text-sm md:text-base">{title}</h1>
          <div className="grow"></div>
          <AiOutlineClose
            size={23}
            className="cursor-pointer"
            onClick={onClose}
          />
        </div>
        <hr />
        <div className="p-4">{children}</div>
      </div>
    </Backdrop>
  )
})
