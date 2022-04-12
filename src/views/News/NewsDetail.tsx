import { useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import qs from 'query-string'

import { Result } from 'components'
import { EAction } from 'enums'
import { db } from 'libs/firebase'
import NotFound from 'views/NotFound/NotFound'

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
    action,
    province,
    ward,
    district,
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
              src={video.value}
            ></iframe>
          ) : (
            <Result title="Video đã bị ẩn do chứa nội dung không phù hợp" />
          )}
        </>
      ) : null}
      <div className="my-2 py-2 bg-[#f4f4f4] text-center font-light text-sm space-x-2">
        <Link
          className="link"
          to={{
            pathname: action === EAction.trade ? '/mua-ban' : '/cho-thue',
            search: qs.stringify({
              province,
            }),
          }}
        >
          {provinceName}
        </Link>{' '}
        /
        <Link
          className="link"
          to={{
            pathname: action === EAction.trade ? '/mua-ban' : '/cho-thue',
            search: qs.stringify({
              district,
              province,
            }),
          }}
        >
          {districtName}
        </Link>{' '}
        /
        <Link
          className="link"
          to={{
            pathname: action === EAction.trade ? '/mua-ban' : '/cho-thue',
            search: qs.stringify({
              province,
              ward,
              district,
            }),
          }}
        >
          {wardName}
        </Link>
      </div>
      <div className="m-5 flex flex-col space-y-5 items-center overflow-hidden">
        <span>
          <h1 className="font-medium text-center">{subject}</h1>
          {price && <b className="font-medium text-red-500">{price} tỷ</b>}
        </span>
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
