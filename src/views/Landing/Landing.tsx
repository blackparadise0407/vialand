import { Fragment, useEffect, useState } from 'react'
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import Slider, { Settings } from 'react-slick'
import { toast } from 'react-toastify'

import {
  eighth,
  fifth,
  first,
  fourth,
  ninth,
  second,
  seventh,
  sixth,
  third,
} from 'assets/images'
import { NewsCard } from 'components'
import { RETRY_ERROR } from 'constants/message'
import { db } from 'libs/firebase'
import { useTranslation } from 'react-i18next'

const settings: Settings = {
  autoplay: true,
  dots: true,
  fade: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  accessibility: true,
}

const images = [
  first,
  second,
  third,
  fourth,
  fifth,
  sixth,
  seventh,
  eighth,
  ninth,
]

export default function LandingPage() {
  const { t } = useTranslation()
  const [propertyList, setPropertyList] = useState<IProperty[]>([])

  useEffect(() => {
    const q = query(
      collection(db, 'properties'),
      orderBy('createdAt', 'desc'),
      where('published', '==', true),
      limit(10),
    )
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const properties: IProperty[] = []
        querySnapshot.forEach((doc) => {
          properties.push({
            id: doc.id,
            ...doc.data(),
          } as any)
        })
        setPropertyList(properties)
      },
      (e) => {
        console.log(e)
        toast.error(RETRY_ERROR)
      },
    )
    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <Fragment>
      <Slider className="h-[30vh] md:h-[56vh] w-full" {...settings}>
        {images.map((x, idx) => (
          <div key={idx}>
            <div
              className="w-full h-[30vh] md:h-[56vh]"
              style={{
                background: `url(${x}) center no-repeat`,
                backgroundSize: 'cover',
              }}
            ></div>
          </div>
        ))}
      </Slider>

      <div className="flex flex-col xl:flex-row gap-16 m-5 md:m-10">
        <div
          className="relative max-w-[89vh] w-full h-[59vh] mx-auto"
          style={{
            background: `url(${eighth}) center no-repeat`,
            backgroundSize: 'cover',
          }}
        >
          <div className="absolute bottom-0 left-0 w-full text-white text-xl p-[20px] bg-black bg-opacity-50">
            <p className="text-center">{t('lavender_project')}</p>
          </div>
        </div>
        <div className="space-y-5 w-full xl:w-1/2">
          {propertyList.map((x) => (
            <NewsCard key={x.id} data={x} />
          ))}
        </div>
      </div>
    </Fragment>
  )
}
