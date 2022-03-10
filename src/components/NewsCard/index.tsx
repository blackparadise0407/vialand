type NewsCardProps = {
  data: IProperty
}

export default function NewsCard({ data }: NewsCardProps) {
  if (!data) return null

  const { subject, image } = data

  return (
    <div className="flex gap-5">
      <img className="w-[128px]" src={image} alt="" />
      <div className="">
        <p className="text-base font-light">{subject}</p>
      </div>
    </div>
  )
}
