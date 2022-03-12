import clsx from 'clsx'
import { memo, ReactNode } from 'react'
import { FieldError } from 'react-hook-form'
import FormError from './FormError'
import FormLabel from './FormLabel'

type FormGroupProps = {
  label?: string
  children: ReactNode
  htmlFor?: string
  error?: FieldError
  className?: string
}

export default memo(function FormGroup({
  children,
  label = '',
  htmlFor = '',
  error = undefined,
  className = '',
}: FormGroupProps) {
  return (
    <div className={clsx('form-input', className)}>
      <FormLabel htmlFor={htmlFor} title={label} />
      {children}
      <FormError label={label} error={error} />
    </div>
  )
})
