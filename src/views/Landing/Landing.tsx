import Slider, { Settings } from 'react-slick'
import {
  first,
  second,
  third,
  fourth,
  fifth,
  sixth,
  seventh,
  eighth,
  ninth,
} from 'assets/images'
import { NewsCard } from 'components'
import { Fragment, useEffect, useState } from 'react'
import { db } from 'libs/firebase'
import {
  collection,
  doc,
  onSnapshot,
  query,
  orderBy,
  limit,
} from 'firebase/firestore'
import { toast } from 'react-toastify'
import { RETRY_ERROR } from 'constants/message'

const settings: Settings = {
  autoplay: true,
  dots: false,
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

const data: any[] = [
  {
    id: '1',
    subject:
      'NHÀ BÁN GẤP tại QUẬN 1 - TPHCM giá rẻ, chính chủ, có sổ hồng cập nhật 01/2021...',
    image: second,
    description: '',
  },
  {
    id: '2',
    subject:
      'NHÀ BÁN GẤP tại QUẬN 1 - TPHCM giá rẻ, chính chủ, có sổ hồng cập nhật 01/2021...',
    image: second,
    description: '',
  },
  {
    id: '3',
    subject:
      'NHÀ BÁN GẤP tại QUẬN 1 - TPHCM giá rẻ, chính chủ, có sổ hồng cập nhật 01/2021...',
    image: second,
    description: '',
  },
  {
    id: '4',
    subject:
      'NHÀ BÁN GẤP tại QUẬN 1 - TPHCM giá rẻ, chính chủ, có sổ hồng cập nhật 01/2021...',
    image: second,
    description: '',
  },
  {
    id: '5',
    subject:
      'NHÀ BÁN GẤP tại QUẬN 1 - TPHCM giá rẻ, chính chủ, có sổ hồng cập nhật 01/2021...',
    image: second,
    description: '',
  },
]
export default function LandingPage() {
  const [propertyList, setPropertyList] = useState<IProperty[]>([])

  useEffect(() => {
    const q = query(
      collection(db, 'properties'),
      orderBy('createdAt', 'desc'),
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
      () => {
        toast.error(RETRY_ERROR)
      },
    )
    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <Fragment>
      <Slider
        className="h-[30vh] md:h-[56vh] w-full overflow-hidden"
        {...settings}
      >
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
            <p className="text-center">Dự Án Lavender Central Mall</p>
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
