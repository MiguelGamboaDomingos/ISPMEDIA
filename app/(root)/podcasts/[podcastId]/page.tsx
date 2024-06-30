'use client'

import EmptyState from '@/components/EmptyState'
import LoaderSpinner from '@/components/LoaderSpinner'
import MediaCard from '@/components/MediaCard'
import MediaDetailPlayer from '@/components/MediaDetailPlayer'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import Image from 'next/image'
import React from 'react'

const MediaDetails = ({ params: { mediaId } }: { params: { mediaId: Id<'medias'> } }) => {
  const { user } = useUser();

  const media = useQuery(api.medias.getMediaById, { mediaId })

  const similarMedias = useQuery(api.medias.getMediaByVoiceType, { mediaId })

  const isOwner = user?.id === media?.authorId;

  if(!similarMedias || !media) return <LoaderSpinner />

  return (
    <section className="flex w-full flex-col">
      <header className="mt-9 flex items-center justify-between">
        <h1 className="text-20 font-bold text-white-1">
          Currenty Playing
        </h1>
        <figure className="flex gap-3">
          <Image
            src="/icons/headphone.svg"
            width={24}
            height={24}
            alt="headphone"
          />
          <h2 className="text-16 font-bold text-white-1">{media?.views}</h2>
        </figure>
      </header>

      <MediaDetailPlayer 
        isOwner={isOwner}
        mediaId={media._id}
        {...media}
      />

      <p className="text-white-2 text-16 pb-8 pt-[45px] font-medium max-md:text-center">{media?.mediaDescription}</p>

      <div className="flex flex-col gap-8">
        <div className='flex flex-col gap-4'>
          <h1 className='text-18 font-bold text-white-1'>Transcription</h1>
          <p className="text-16 font-medium text-white-2">{media?.voicePrompt}</p>
        </div>
        <div className='flex flex-col gap-4'>
          <h1 className='text-18 font-bold text-white-1'>Thumbnail Prompt</h1>
          <p className="text-16 font-medium text-white-2">{media?.imagePrompt}</p>
        </div>
      </div>
      <section className="mt-8 flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Medias Relacionados</h1>

        {similarMedias && similarMedias.length > 0 ? (
          <div className="media_grid">
            {similarMedias?.map(({ _id, mediaTitle, mediaDescription, imageUrl }) => (
              <MediaCard 
                key={_id}
                imgUrl={imageUrl as string}
                title={mediaTitle}
                description={mediaDescription}
                mediaId={_id}
              />
            ))}
          </div>
        ) : (
          <> 
            <EmptyState 
              title="Nenhum media relacionado"
              buttonLink="/discover"
              buttonText="Explore Mais Medias"
            />
          </>
        )}
      </section>

    </section>
  )
}

export default MediaDetails