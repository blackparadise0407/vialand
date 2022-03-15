import { useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { Link, useParams } from 'react-router-dom'

import { db } from 'libs/firebase'
import NotFound from 'views/NotFound/NotFound'
import { Result } from 'components'

export default function NewsDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [news, setnews] = useState<IProperty>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function eff() {
      setLoading(true)
      try {
        const docRef = collection(db, 'properties')
        const q = query(docRef, where('slug', '==', slug))
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
              src={video}
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
        <div className="mx-auto font-sans text-justify text-base space-y-5">
          <p>Diện tích: {size} m²</p>
          <p>Kết cấu: {structure}</p>
          <p>Kiến trúc: {architecture}</p>
          <p>
            Vị trí: Hướng {direction}. {address}
          </p>
          <p>{description}</p>
          <p>
            Điện thoại liên hệ: {contactNumber} ({contactName})
          </p>
        </div>
      </div>
    </div>
  )
}
