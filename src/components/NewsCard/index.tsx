type NewsCardProps = {
  data: INews;
};

export default function NewsCard({ data }: NewsCardProps) {
  if (!data) return null;

  const { title, url } = data;

  return (
    <div className="flex gap-5">
      <img className="w-[128px]" src={url} alt="" />
      <div className="">
        <p className="text-base font-light">{title}</p>
      </div>
    </div>
  );
}
