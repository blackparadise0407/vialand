import { Fragment, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
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
import { Alert, NewsCard } from 'components'
import { RETRY_ERROR } from 'constants/message'
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import { useWindowSize } from 'hooks/useWindowSize'
import { db } from 'libs/firebase'
import { ProjectCard } from './Projects'

const settings: Settings = {
  autoplay: true,
  autoplaySpeed: 5000,
  dots: false,
  fade: true,
  infinite: true,
  speed: 300,
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
  const [w] = useWindowSize()
  const projectSettings = useMemo<Settings>(() => {
    let slidesToShow = 3
    if (w > 768 && w < 1024) slidesToShow = 2
    else if (w < 768) slidesToShow = 1

    return {
      autoplay: true,
      autoplaySpeed: 5000,
      fade: false,
      infinite: true,
      speed: 500,
      slidesToShow,
      slidesToScroll: 1,
      arrows: true,
      accessibility: true,
    }
  }, [w])

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
      {/* Image carousel */}
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
      <Alert title="Vui lòng tải Chrome trên Android hoặc iOS để xem" />
      <div className="mx-5 md:mx-10">
        {/* Project carousel */}
        <div className="my-12">
          <div className="flex items-center">
            <h1 className="font-bold md:text-xl">{t('real_estate_project')}</h1>
            <div className="flex-grow"></div>
            <Link to="/dang-tin">
              <button className="btn btn--secondary">{t('post_news')}</button>
            </Link>
          </div>
          <Slider
            className="w-[calc(100%+2rem)] -left-4 mx-auto mt-5"
            {...projectSettings}
          >
            {images.map((x, idx) => (
              <div className="px-4" key={idx}>
                <ProjectCard key={idx} />
              </div>
            ))}
          </Slider>
        </div>

        <div className="flex flex-col xl:flex-row gap-16 my-5">
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
          <div className="space-y-5 w-full xl:w-1/2 h-auto xl:h-[59vh] overflow-y-auto">
            {propertyList.map((x) => (
              <NewsCard key={x.id} data={x} />
            ))}
          </div>
        </div>
      </div>
    </Fragment>
  )
}
