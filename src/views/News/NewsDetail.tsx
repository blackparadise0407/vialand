import { useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { db } from 'libs/firebase'
import NotFound from 'views/NotFound/NotFound'
import { Result } from 'components'

export default function NewsDetail() {
  const { t } = useTranslation()
  const { slug } = useParams<{ slug: string }>()
  const [news, setnews] = useState<IProperty>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function eff() {
      setLoading(true)
      try {
        const docRef = collection(db, 'properties')
        const q = query(
          docRef,
          where('slug', '==', slug),
          where('published', '==', true),
        )
        const snapshot = await getDocs(q)
        snapshot.forEach((doc) => {
          setnews({ id: doc.id, ...doc.data() } as any)
        })
      } catch (e) {
      } finally {
        setLoading(false)
      }
    }
    eff()
  }, [slug])

  if (loading) return <div>Loading...</div>

  if (!news) return <NotFound />

  const {
    subject,
    size,
    structure,
    architecture,
    wardName,
    districtName,
    provinceName,
    description,
    contactName,
    contactNumber,
    direction,
    address,
    video,
    hideVideo,
    price,
  } = news

  return (
    <div className="">
      {video ? (
        <>
          {!hideVideo ? (
            <iframe
              title="video"
              loading="lazy"
              allowFullScreen
              className="mx-auto my-5 max-w-[720px] w-full aspect-video"
              src="//gdriveplayer.to/embed2.php?link=i0S9xp6kC0C7JXuAlhwT5As2%252FUYr9oMrSt98w9JT7%252FLyqAaXY5vCzYlxjjlyR8Z6ajqwSa5fqQ6XCm0vcEm3%252FaWGoMRSl2Ko8wMDXVOu8rgkbU77bgpV9ycW%252FbkKbSNpV1xBFE8gpQXGX75gozJhuHsl1coIPq84bPf8QXtZvswiJnqBoHw6NsniTTDvh1tJa%252FRbCVhATXlnOFlOBRH4li8oAWC4IClDJ3E79hU0MMYjc1Wf3cRfzsRrdLHoKBVOs%253D"
            ></iframe>
          ) : (
            <Result title="Video đã bị ẩn do chứa nội dung không phù hợp" />
          )}
        </>
      ) : null}
      <div className="my-2 py-2 bg-[#f4f4f4] text-center font-light text-sm space-x-2">
        <Link className="link" to="/nha-dat">
          {provinceName}
        </Link>{' '}
        /
        <Link className="link" to="/nha-dat">
          {districtName}
        </Link>{' '}
        /
        <Link className="link" to="/nha-dat">
          {wardName}
        </Link>
      </div>
      <div className="m-5 flex flex-col space-y-5 items-center overflow-hidden">
        <h1 className="font-medium text-center">{subject}</h1>
        {price && <b className="font-medium text-red-500">{price} tỷ</b>}
        <div className="mx-auto font-sans text-justify text-base space-y-5">
          <p>
            {t('size')}: {size} m²
          </p>
          <p>
            {t('structure')}: {structure}
          </p>
          <p>
            {t('architecture')}: {architecture}
          </p>
          <p>
            {t('location')}: {t('direction')} {direction}. {address}
          </p>
          <p>{description}</p>
          <p>
            {t('contact_phone')}: {contactNumber} ({contactName})
          </p>
        </div>
      </div>
    </div>
  )
}
