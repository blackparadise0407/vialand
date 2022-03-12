import { second } from 'assets/images'
import { Link } from 'react-router-dom'

type NewsCardProps = {
  data: IProperty
}

export default function NewsCard({ data }: NewsCardProps) {
  if (!data) return null

  const { subject, images } = data

  return (
    <Link to={`/nha-dat/${data.id}`}>
      <div className="flex gap-5 hover:shadow p-2 cursor-pointer">
        <img
          className="w-[128px] aspect-video"
          src={images?.length ? images[0] : second}
          alt=""
        />
        <div className="overflow-hidden">
          <p className="truncate text-base font-light">{subject}</p>
        </div>
      </div>
    </Link>
  )
}
