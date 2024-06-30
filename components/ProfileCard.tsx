import Image from "next/image";
import { useEffect, useState } from "react";

import { useDMedia } from "@/providers/MediaProvider";
import { MediaProps, ProfileCardProps } from "@/types";

import LoaderSpinner from "./LoaderSpinner";
import { Button } from "./ui/button";

const ProfileCard = ({
  mediaData,
  imageUrl,
  userFirstName,
}: ProfileCardProps) => {
  const { setDMedia } = useDMedia();

  const [randomMedia, setRandomMedia] = useState<MediaProps | null>(null);

  const playRandomMedia = () => {
    const randomIndex = Math.floor(Math.random() * mediaData.medias.length);

    setRandomMedia(mediaData.medias[randomIndex]);
  };

  useEffect(() => {
    if (randomMedia) {
      setDMedia({
        title: randomMedia.mediaTitle,
        mediaUrl: randomMedia.mediaUrl || "",
        imageUrl: randomMedia.imageUrl || "",
        author: randomMedia.author,
        mediaId: randomMedia._id,
      });
    }
  }, [randomMedia, setDMedia]);

  if (!imageUrl) return <LoaderSpinner />;

  return (
    <div className="mt-6 flex flex-col gap-6 max-md:items-center md:flex-row">
      <div className="aspect-square rounded-lg overflow-hidden">
        <Image
          src={imageUrl}
          width={250}
          height={250}
          alt="Criador"
        />
      </div>
      <div className="flex flex-col justify-center max-md:items-center">
        <div className="flex flex-col gap-2.5">
          <figure className="flex gap-2 max-md:justify-center">
            <Image
              src="/icons/verified.svg"
              width={15}
              height={15}
              alt="verified"
            />
            <h2 className="text-14 font-medium text-white-2">
              Verified Creator
            </h2>
          </figure>
          <h1 className="text-32 font-extrabold tracking-[-0.32px] text-white-1">
            {userFirstName}
          </h1>
        </div>
        <figure className="flex gap-3 py-6">
          <Image
            src="/icons/headphone.svg"
            width={24}
            height={24}
            alt="headphones"
          />
          <h2 className="text-16 font-semibold text-white-1">
            {mediaData?.audience} &nbsp;
            <span className="font-normal text-white-2">monthly listeners</span>
          </h2>
        </figure>
        {mediaData?.medias.length > 0 && (
          <Button
            onClick={playRandomMedia}
            className="text-16 bg-orange-1 font-extrabold text-white-1"
          >
            <Image
              src="/icons/Play.svg"
              width={20}
              height={20}
              alt="random play"
            />{" "}
            &nbsp; Reproduzir um Media aleatório
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
