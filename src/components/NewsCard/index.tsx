import { second } from 'assets/images'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

type NewsCardProps = {
  className?: string
  data: IProperty
}

export default function NewsCard({ className = '', data }: NewsCardProps) {
  const { t } = useTranslation()
  if (!data) return null

  const { subject, price, createdAt } = data
  return (
    <Link
      className={clsx('block hover:shadow', className)}
      to={`/${data.slug}`}
    >
      <div className="flex gap-5 p-2 cursor-pointer h-full">
        <img className="w-[128px] aspect-video" src={second} alt="" />
        <div className="overflow-hidden flex flex-col text-base font-light w-full">
          <p className="truncate">{subject}</p>
          {price && (
            <b className="font-medium text-red-500">
              {price} {t('billion')} {t('currency')}
            </b>
          )}
          <div className="grow"></div>
          <p className="text-right text-gray-500 text-sm">
            {t('date_posted')}: {dayjs(createdAt * 1000).format('DD/MM/YYYY')}
          </p>
        </div>
      </div>
    </Link>
  )
}
