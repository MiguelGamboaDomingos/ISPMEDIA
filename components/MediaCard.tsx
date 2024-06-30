import { MediaCardProps } from '@/types'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const MediaCard = ({
  imgUrl, title, description, mediaId
}: MediaCardProps) => {
  const router = useRouter()

  const handleViews = () => {
    // increase views

    router.push(`/medias/${mediaId}`, {
      scroll: true
    })
  }

  return (
    <div className="cursor-pointer" onClick={handleViews}>
      <figure className="flex flex-col gap-2">
        <Image 
          src={imgUrl}
          width={174}
          height={174}
          alt={title}
          className="aspect-square h-fit w-full rounded-xl 2xl:size-[200px]"
        />
        <div className="flex flex-col">
          <h1 className="text-16 truncate font-bold text-white-1">{title}</h1>
          <h2 className="text-12 truncate font-normal capitalize text-white-4">{description}</h2>
        </div>
      </figure>
    </div>
  )
}

export default MediaCard