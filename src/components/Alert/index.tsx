type AlertProps = {
  title?: string
}

export default function Alert({ title }: AlertProps) {
  return <div className="text-center text-sm text-red-600 my-2">{title}</div>
}
