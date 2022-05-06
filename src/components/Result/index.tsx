import { ReactNode } from 'react'

type ResultProps = {
  title: ReactNode
}

export default function Result({ title }: ResultProps) {
  return (
    <div className="flex py-4 px-2 flex-col items-center">
      <span className="p-5 font-medium bg-gray-100 rounded">{title}</span>
    </div>
  )
}
