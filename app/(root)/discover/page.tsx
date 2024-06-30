"use client"

import EmptyState from '@/components/EmptyState'
import LoaderSpinner from '@/components/LoaderSpinner'
import MediaCard from '@/components/MediaCard'
import Searchbar from '@/components/Searchbar'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import React from 'react'

const Discover = ({ searchParams: { search} }: { searchParams : { search: string }}) => {
  const mediasData = useQuery(api.medias.getMediaBySearch, { search: search || '' })

  return (
    <div className="flex flex-col gap-9">
      <Searchbar />
      <div className="flex flex-col gap-9">
        <h1 className="text-20 font-bold text-white-1">
          {!search ? 'Explore medias recomendados' : 'Procurar por '}
          {search && <span className="text-white-2">{search}</span>}
        </h1>
        {mediasData ? (
          <>
            {mediasData.length > 0 ? (
              <div className="media_grid">
              {mediasData?.map(({ _id, mediaTitle, mediaDescription, imageUrl }) => (
                <MediaCard 
                  key={_id}
                  imgUrl={imageUrl!}
                  title={mediaTitle}
                  description={mediaDescription}
                  mediaId={_id}
                />
              ))}
            </div>
            ) : <EmptyState title="No results found" />}
          </>
        ) : <LoaderSpinner />}
      </div>
    </div>
  )
}

export default Discover