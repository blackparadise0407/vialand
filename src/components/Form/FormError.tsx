import { memo } from 'react'
import { FieldError } from 'react-hook-form'

type FormErrorProps = {
  error: FieldError
  label?: string
}

export default memo(function FormError({ error, label = '' }: FormErrorProps) {
  let errorMessage = ''
  switch (error?.type) {
    case 'required':
      errorMessage = error.message || `Yêu cầu nhập ${label.toLowerCase()}`
      break
    case 'maxLength':
      errorMessage = error.message || `${label} quá dài`
      break
    case 'minLength':
      errorMessage = error.message || `${label} quá ngắn`
      break
    case 'max':
      errorMessage = error.message || `${label} quá lớn`
      break
    case 'min':
      errorMessage = error.message || `${label} quá nhỏ`
      break
    case 'validate':
      errorMessage = error.message || `Yêu cầu nhập ${label.toLowerCase()}`
      break
    case 'pattern':
      errorMessage = error.message || `${label} sai định dạng`
      break
    default:
      break
  }
  if (errorMessage) {
    return <p className="text-sm text-red-500">{errorMessage}</p>
  }
  return null
})
