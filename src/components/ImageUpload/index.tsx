import {
  ChangeEvent,
  DragEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import clsx from 'clsx'
import { AiOutlineClose, AiOutlineUpload } from 'react-icons/ai'
import { toast } from 'react-toastify'

import { readFileAsync } from 'utils/file'

type ImageUploadProps = {
  multiple?: boolean
  max?: number
  className?: string
  onChange?: (fileList: IFile[]) => void
}

export default function ImageUpload({
  className = '',
  multiple = false,
  max,
  onChange,
}: ImageUploadProps) {
  const [active, setActive] = useState(false)
  const [fileList, setFileList] = useState<IFile[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    if (!active) setActive(true)
  }
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    if (active) setActive(false)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const processSingleFile = useCallback(async (iFile: File) => {
    const file = new File([iFile], iFile.name, { type: iFile.type }) as IFile
    file.src = await readFileAsync(iFile)
    file.id = Math.floor(Math.random() * 100000).toString()
    setFileList([file])
  }, [])

  const processFileList = useCallback(
    (fl: FileList) => {
      if (!multiple) {
        processSingleFile(fl[0])
        return
      }

      let _fl = Array.from(fl)
      if (max && fileList.length + fl.length > max) {
        toast.warn('Số lượng ảnh vượt quá mức cho phép')
        const remains = max - fileList.length
        if (remains <= 0) return
        _fl = _fl.slice(0, remains)
      }
      const files = _fl.map(async (x, idx) => {
        const file = new File([x], x.name, {
          type: x.type,
        }) as IFile
        file.src = await readFileAsync(file)
        file.id = Math.floor(Math.random() * 100000).toString()
        return file
      })
      Promise.all(files)
        .then((res) => {
          setFileList((prev) => prev.concat(res))
        })
        .catch((_) => {})
    },
    [max, multiple, fileList, processSingleFile],
  )

  const handleFileDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    processFileList(e.dataTransfer.files)
    setActive(false)
  }

  const handleDelete = useCallback(
    (e: MouseEvent<SVGElement>, id?: string) => {
      e.stopPropagation()
      if (!multiple) {
        setFileList([])
        return
      }

      setFileList((prev) => {
        const clone = Array.from(prev)
        const foundIdx = clone.findIndex((x) => x.id === id)
        if (foundIdx > -1) {
          clone.splice(foundIdx, 1)
          return clone
        }
        return prev
      })
    },
    [multiple],
  )

  useEffect(() => {
    onChange?.(fileList)
  }, [fileList, onChange])

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    inputRef.current?.click()
  }

  const handleFileChoose = (e: ChangeEvent<HTMLInputElement>) => {
    multiple
      ? processFileList(e.target.files)
      : processSingleFile(e.target.files[0])
  }

  return (
    <div className={className}>
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleFileDrop}
        onClick={handleClick}
        className="relative aspect-video grid place-items-center border-dashed border-2 p-2 border-blue-400 rounded cursor-pointer"
      >
        <div className="flex flex-col items-center -z-10">
          {!multiple && !!fileList.length ? (
            <img src={fileList[0]?.src} alt="" />
          ) : (
            <>
              <AiOutlineUpload
                className={clsx('text-blue-400', active && 'animate-bounce')}
                size={38}
              />
              <p className="text-sm">
                Kéo thả hoặc nhấp chuột để upload hình ảnh
              </p>
            </>
          )}
        </div>
        {!multiple && !!fileList.length && (
          <AiOutlineClose
            color="#000"
            size={21}
            className="absolute select-none rounded-full shadow cursor-pointer bg-white -top-1 -right-1 p-1"
            onClick={handleDelete}
          />
        )}
      </div>
      {multiple && !!fileList.length && (
        <div className="flex flex-wrap gap-1 mt-2 w-full">
          {fileList.map((x) => (
            <div className="relative w-[80px] overflow-hidden" key={x.id}>
              <img src={x?.src} alt="" />
              <AiOutlineClose
                color="#000"
                size={21}
                className="absolute select-none rounded-full shadow cursor-pointer bg-white top-1 right-1 p-1"
                onClick={(e) => handleDelete(e, x.id)}
              />
            </div>
          ))}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        onChange={handleFileChoose}
        className="hidden"
        accept="image/*"
        // multiple={multiple}
        onClick={(e: any) => {
          e.target.value = null
        }}
      />
    </div>
  )
}
