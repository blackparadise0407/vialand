import { second } from 'assets/images'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'

type NewsCardProps = {
  className?: string
  data: IProperty
}

export default function NewsCard({ className = '', data }: NewsCardProps) {
  if (!data) return null

  const { subject, images, createdAt } = data

  return (
    <Link
      className={clsx('block hover:shadow', className)}
      to={`/${data.slug}`}
    >
      <div className="flex gap-5 p-2 cursor-pointer h-full">
        <img
          className="w-[128px] aspect-video"
          src={images?.length ? images[0] : second}
          alt=""
        />
        <div className="overflow-hidden flex flex-col text-base font-light w-full">
          <p className="truncate">{subject}</p>
          <div className="grow"></div>
          <p className="text-right text-gray-500 text-sm">
            Ngày đăng tin: {dayjs(createdAt * 1000).format('DD/MM/YYYY')}
          </p>
        </div>
      </div>
    </Link>
  )
}
