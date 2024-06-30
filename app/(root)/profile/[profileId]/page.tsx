"use client";

import { useQuery } from "convex/react";

import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import MediaCard from "@/components/MediaCard";
import ProfileCard from "@/components/ProfileCard";
import { api } from "@/convex/_generated/api";

const ProfilePage = ({
  params,
}: {
  params: {
    profileId: string;
  };
}) => {
  const user = useQuery(api.users.getUserById, {
    clerkId: params.profileId,
  });
  const mediasData = useQuery(api.medias.getMediaByAuthorId, {
    authorId: params.profileId,
  });

  if (!user || !mediasData) return <LoaderSpinner />;

  return (
    <section className="mt-9 flex flex-col">
      <h1 className="text-20 font-bold text-white-1 max-md:text-center">
        Perfil de Criador
      </h1>
      <div className="mt-6 flex flex-col gap-6 max-md:items-center md:flex-row">
        <ProfileCard
          mediaData={mediasData!}
          imageUrl={user?.imageUrl!}
          userFirstName={user?.name!}
        />
      </div>
      <section className="mt-9 flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Todos os Medias</h1>
        {mediasData && mediasData.medias.length > 0 ? (
          <div className="media_grid">
            {mediasData?.medias
              ?.slice(0, 4)
              .map((media) => (
                <MediaCard
                  key={media._id}
                  imgUrl={media.imageUrl!}
                  title={media.mediaTitle!}
                  description={media.mediaDescription}
                  mediaId={media._id}
                />
              ))}
          </div>
        ) : (
          <EmptyState
            title="Nenhum media adicionado"
            buttonLink="/create-media"
            buttonText="Criar Media"
          />
        )}
      </section>
    </section>
  );
};

export default ProfilePage;
