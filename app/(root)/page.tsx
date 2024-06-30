"use client";
import MediaCard from '@/components/MediaCard'
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import LoaderSpinner from '@/components/LoaderSpinner';

const Home = () => {
  const trendingMedias = useQuery(api.medias.getTrendingMedias);

  if(!trendingMedias) return <LoaderSpinner />
  
  return (
    <div className="mt-9 flex flex-col gap-9 md:overflow-hidden">
      <section className='flex flex-col gap-5'>
        <h1 className="text-20 font-bold text-white-1">Trending Podcasts</h1>

        <div className="media_grid">
          {trendingMedias?.map(({ _id, mediaTitle, mediaDescription, imageUrl }) => (
            <MediaCard 
              key={_id}
              imgUrl={imageUrl as string}
              title={mediaTitle}
              description={mediaDescription}
              mediaId={_id}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home