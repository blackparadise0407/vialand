import { memo, ReactNode } from 'react'

type BackdropProps = {
  children?: ReactNode
  onClick?: () => void
}

export default memo(function Backdrop({
  children,
  onClick = () => {},
}: BackdropProps) {
  return (
    <div
      className="fixed top-0 right-0 bottom-0 left-0 bg-slate-500 bg-opacity-50 z-50"
      onClick={onClick}
    >
      {children}
    </div>
  )
})
