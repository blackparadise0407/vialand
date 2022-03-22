import _slugify from 'slugify'

export const slugify = (str: string) =>
  _slugify(str, {
    replacement: '-',
    lower: true,
    strict: true,
    locale: 'vi',
    trim: true,
  })

export const generatePaymentCode = (length: number = 6) => {
  let text = ''
  const validSet =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (var i = 0; i < length; i++)
    text += validSet.charAt(Math.floor(Math.random() * validSet.length))

  return text
}
