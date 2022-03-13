import _slugify from 'slugify'

export const slugify = (str: string) =>
  _slugify(str, {
    replacement: '-',
    lower: true,
    strict: true,
    locale: 'vi',
    trim: true,
  })
