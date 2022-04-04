import { second } from 'assets/images'
import { AiOutlineIdcard } from 'react-icons/ai'
import { FiMapPin } from 'react-icons/fi'
import { MdOutlineMapsHomeWork } from 'react-icons/md'

type ProjectCardProps = {}

export default function ProjectCard({}: ProjectCardProps) {
  return (
    <div className="relative w-full mx-auto rounded shadow bg-white overflow-hidden">
      <div className="relative">
        <div className="relative w-full aspect-video overflow-hidden">
          <img
            className="absolute w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            src={second}
            alt=""
          />
        </div>
        <div className="absolute top-[100%] left-3 bg-gray-300 px-2 py-0.5 rounded text-sm  z-10 -translate-y-1/2">
          Đã hoàn thành
        </div>
      </div>
      <div className="p-3">
        <h1 className="font-semibold tracking-tight text-base md:text-lg lg:text-xl text-orange-500 mt-2">
          Giá từ 1.5 ~ 9 tỷ/căn
        </h1>
        <h2 className="font-semibold tracking-tight text-base md:text-lg lg:text-xl text-black">
          The Sun Avenue
        </h2>
        <div className="flex items-center space-x-2">
          <FiMapPin className="text-gray-400 text-sm md:text-base" />
          <span className="text-sm md:text-base font-medium">
            28 Mai Chí Thọ
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <MdOutlineMapsHomeWork className="text-gray-400 text-sm md:text-base" />
          <span className="text-sm md:text-base font-medium">
            Quy mô: 8 Block / 1888 căn
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <AiOutlineIdcard className="text-gray-400 text-sm md:text-base" />
          <span className="text-sm md:text-base font-medium">
            Chủ đầu tư: Tập đoàn Novaland
          </span>
        </div>
      </div>
    </div>
  )
}
