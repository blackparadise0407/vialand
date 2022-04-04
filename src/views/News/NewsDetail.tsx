import { useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

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
              src={
                '//gdriveplayer.to/embed2.php?link=XeLxw%252BXNR0jzZdlv1UFBBwP%252BDzW8HLlv9vW2pezSgQvU4%252BXNimMRGnhajexsanezDmG4D8OuloDnQYByZMh%252F9NwUtp5GIO%252BpUlsOpTym5oGRCfi8palzhzE2T%252BUiT5Oiz8NuhFBtC1k1%252Fyale4hIizptv4v0P7LkcYfPXitOh%252BZbRcVpWfD%252B%252F7zvC94QyK8IqtVhSP4roDSFyqjeH8lw39IDFsKvjzUhuNeR09HjF0lXPzKw3KSAVvU1djpQ62hjs%253D'
              }
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
          }}
        >
          {provinceName}
        </Link>{' '}
        /
        <Link
          className="link"
          to={{
            pathname: action === EAction.trade ? '/mua-ban' : '/cho-thue',
          }}
        >
          {districtName}
        </Link>{' '}
        /
        <Link
          className="link"
          to={{
            pathname: action === EAction.trade ? '/mua-ban' : '/cho-thue',
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
