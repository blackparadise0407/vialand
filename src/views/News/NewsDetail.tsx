import { useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import qs from 'query-string'
import { FaPlay } from 'react-icons/fa'

import { Result } from 'components'
import { EAction } from 'enums'
import { db } from 'libs/firebase'
import NotFound from 'views/NotFound/NotFound'
import { isMobile } from 'utils/common'

const _renderVideo = ({
  vidSrc,
  hideVideo,
  isMobile,
}: {
  vidSrc: string
  hideVideo: boolean
  isMobile: boolean
}): JSX.Element => {
  if (!vidSrc) {
    return <Result title="Video hiện không khả dụng" />
  }

  if (hideVideo) {
    return <Result title="Video đã bị ẩn do chứa nội dung không phù hợp" />
  }

  if (isMobile) {
    return (
      <div className="relative max-w-[768px] h-full mx-auto w-full ">
        <div className="aspect-vid bg-black"></div>
        <a href={vidSrc} target="_blank" rel="noreferrer">
          <FaPlay className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl shadow text-white" />
        </a>
      </div>
    )
  }
  return (
    <iframe
      title="video"
      loading="lazy"
      allowFullScreen
      className="mx-auto my-5 max-w-[720px] w-full aspect-video"
      src={vidSrc}
    ></iframe>
  )
}

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
    length,
    width,
  } = news

  let area: any = width * length
  area = Number.isInteger(area) ? area : area.toFixed(2)

  const unitTransKey = action === EAction.trade ? 'billion' : 'million'

  return (
    <div className="">
      {/* {video ? (
        <>
          {!hideVideo && !isMobile() ? (
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
      ) : (
        <Result title="Video hiện không khả dụng" />
      )} */}
      {_renderVideo({
        vidSrc: video?.value,
        hideVideo,
        isMobile: isMobile(),
      })}
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
        <span className="text-center">
          <h1 className="font-medium">{subject}</h1>
          {price && (
            <b className="font-medium text-red-500">
              {price} {t(unitTransKey)}
            </b>
          )}
        </span>
        <div className="mx-auto font-sans text-justify text-base space-y-5">
          <p>
            {t('size')}: {area}m² ({width} x {length}m)
          </p>
          <p>
            {t('structure')}: {structure}
          </p>
          <p>
            {t('architecture')}: {architecture}
          </p>
          <p>
            {t('location')}: {t('direction')} {direction}
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
