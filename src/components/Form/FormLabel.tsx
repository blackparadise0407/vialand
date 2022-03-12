import { HTMLProps, memo } from 'react'

type FormLabelProps = {
  title: string
} & HTMLProps<HTMLLabelElement>

export default memo(function FormLabel({ title, ...rest }: FormLabelProps) {
  return <label {...rest}>{title}</label>
})
