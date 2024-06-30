/* eslint-disable no-unused-vars */

import { Dispatch, SetStateAction } from "react";

import { Id } from "@/convex/_generated/dataModel";

export interface EmptyStateProps {
  title: string;
  search?: boolean;
  buttonText?: string;
  buttonLink?: string;
}

export interface TopMediaCreatorsProps {
  _id: Id<"users">;
  _creationTime: number;
  email: string;
  imageUrl: string;
  clerkId: string;
  name: string;
  media: {
    mediaTitle: string;
    mediaId: Id<"medias">;
  }[];
  totalMedias: number;
}

export interface MediaProps {
  _id: Id<"medias">;
  _creationTime: number;
  storageId: Id<"_storage"> | null;
  user: Id<"users">;
  mediaTitle: string;
  mediaDescription: string;
  mediaUrl: string | null;
  imageUrl: string | null;
  imageStorageId: Id<"_storage"> | null;
  author: string;
  authorId: string;
  authorImageUrl: string;
  voicePrompt: string;
  imagePrompt: string | null;
  voiceType: string;
  mediaDuration: number;
  views: number;
  type: 'audio' | 'video';
}


export interface ProfileMediaProps {
  medias: MediaProps[];
  audience: number;
}

export interface GenerateAudioProps {
  voiceType: string;
  setAudio: Dispatch<SetStateAction<string>>;
  media: string;
  setAudioStorageId: Dispatch<SetStateAction<Id<"_storage"> | null>>;
  voicePrompt: string;
  setVoicePrompt: Dispatch<SetStateAction<string>>;
  setMediaDuration: Dispatch<SetStateAction<number>>;

}

export interface GenerateThumbnailProps {
  setImage: Dispatch<SetStateAction<string>>;
  setImageStorageId: Dispatch<SetStateAction<Id<"_storage"> | null>>;
  image: string;
  imagePrompt: string;
  setImagePrompt: Dispatch<SetStateAction<string>>;
  onGenerate?: () => void;
}

export interface LatestMediaCardProps {
  imgUrl: string;
  title: string;
  duration: string;
  index: number;
  mediaUrl: string;
  author: string;
  views: number;
  mediaId: Id<"medias">;
}

export interface MediaDetailPlayerProps {
  mediaUrl: string;
  mediaTitle: string;
  author: string;
  isOwner: boolean;
  imageUrl: string;
  mediaId: Id<"medias">;
  imageStorageId: Id<"_storage">;
  storageId: Id<"_storage">;
  authorImageUrl: string;
  authorId: string;
}

export interface MediaProps {
  title: string;
  mediaUrl: string | null;
  author: string;
  imageUrl: string | null;
  mediaId: string;
}

export interface DMediaContextType {
  dmedia: DMediaProps | undefined;
  setDMedia: React.Dispatch<React.SetStateAction<DMediaProps | undefined>>;
}
export interface MediaCardProps {
  imgUrl: string;
  title: string;
  description: string;
  mediaId: Id<"medias">;
}

export interface DMediaProps {
  title: string;
  mediaUrl: string;
  author: string;
  imageUrl: string;
  mediaId: string;
}

export interface CarouselProps {
  fansLikeDetail: TopMediaCreatorsProps[];
}

export interface ProfileCardProps {
  mediaData: ProfileMediaProps;
  imageUrl: string;
  userFirstName: string;
}

export type UseDotButtonType = {
  selectedIndex: number;
  scrollSnaps: number[];
  onDotButtonClick: (index: number) => void;
};