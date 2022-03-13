import { second } from 'assets/images'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'

type NewsCardProps = {
  data: IProperty
}

export default function NewsCard({ data }: NewsCardProps) {
  if (!data) return null

  const { subject, images, createdAt } = data

  return (
    <Link to={`/nha-dat/${data.slug}`}>
      <div className="flex gap-5 hover:shadow p-2 cursor-pointer">
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
