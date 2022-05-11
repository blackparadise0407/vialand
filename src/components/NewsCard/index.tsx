import clsx from 'clsx'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { second } from 'assets/images'
import { EAction } from 'enums'

type NewsCardProps = {
  className?: string
  data: IProperty
}

export default function NewsCard({ className = '', data }: NewsCardProps) {
  const { t } = useTranslation()
  if (!data) return null

  const { subject, price, createdAt, images, action } = data

  const unitTransKey = action === EAction.trade ? 'billion' : 'million'

  return (
    <Link
      className={clsx('block hover:shadow', className)}
      to={`/${data.slug}`}
    >
      <div className="flex gap-5 p-2 cursor-pointer h-full min-h-[150px]">
        <img
          className="w-[128px] max-h-[100px] aspect-video"
          loading="lazy"
          src={
            images[0]?.id
              ? `https://lh3.googleusercontent.com/d/${images[0].id}`
              : second
          }
          onError={({ currentTarget }) => {
            currentTarget.onerror = null // prevents looping
            currentTarget.src = second
          }}
          alt=""
        />
        <div className="overflow-hidden flex flex-col text-base font-light w-full">
          <p>{subject}</p>
          {price && (
            <b className="font-medium text-red-500">
              {price} {t(unitTransKey)} VND
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
