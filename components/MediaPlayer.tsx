"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { formatTime } from "@/lib/formatTime";
import { cn } from "@/lib/utils";
import { useDMedia } from "@/providers/MediaProvider";

import { Progress } from "./ui/progress";

const MediaPlayer = () => {
  const mediaRef = useRef<HTMLMediaElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const { dmedia } = useDMedia();

  const togglePlayPause = () => {
    if (mediaRef.current?.paused) {
      mediaRef.current?.play();
      setIsPlaying(true);
    } else {
      mediaRef.current?.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (mediaRef.current) {
      mediaRef.current.muted = !isMuted;
      setIsMuted((prev) => !prev);
    }
  };

  const forward = () => {
    if (
      mediaRef.current &&
      mediaRef.current.currentTime &&
      mediaRef.current.duration &&
      mediaRef.current.currentTime + 5 < mediaRef.current.duration
    ) {
      mediaRef.current.currentTime += 5;
    }
  };

  const rewind = () => {
    if (mediaRef.current && mediaRef.current.currentTime - 5 > 0) {
      mediaRef.current.currentTime -= 5;
    } else if (mediaRef.current) {
      mediaRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    const updateCurrentTime = () => {
      if (mediaRef.current) {
        setCurrentTime(mediaRef.current.currentTime);
      }
    };

    const mediaElement = mediaRef.current;
    if (mediaElement) {
      mediaElement.addEventListener("timeupdate", updateCurrentTime);

      return () => {
        mediaElement.removeEventListener("timeupdate", updateCurrentTime);
      };
    }
  }, []);

  useEffect(() => {
    const mediaElement = mediaRef.current;
    if (dmedia?.mediaUrl) {
      if (mediaElement) {
        mediaElement.play().then(() => {
          setIsPlaying(true);
        });
      }
    } else {
      mediaElement?.pause();
      setIsPlaying(true);
    }
  }, [dmedia]);
  const handleLoadedMetadata = () => {
    if (mediaRef.current) {
      setDuration(mediaRef.current.duration);
    }
  };

  const handleMediaEnded = () => {
    setIsPlaying(false);
  };

  return ( 
    <div
      className={cn("sticky bottom-0 left-0 flex size-full flex-col", {
        hidden: !dmedia?.mediaUrl || dmedia?.mediaUrl === "",
      })}
    >
      {/* change the color for indicator inside the Progress component in ui folder */}
      <Progress
        value={(currentTime / duration) * 100}
        className="w-full"
        max={duration}
      />
      <section className="glassmorphism-black flex h-[112px] w-full items-center justify-between px-4 max-md:justify-center max-md:gap-5 md:px-12">
        <audio
          ref={mediaRef}
          src={dmedia?.mediaUrl?? ''}
          className="hidden"
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleMediaEnded}
        />
        <div className="flex items-center gap-4 max-md:hidden">
          <Link href={`/media/${dmedia?.mediaId}`}>
            <Image
              src={dmedia?.imageUrl! || "/images/player1.png"}
              width={64}
              height={64}
              alt="player1"
              className="aspect-square rounded-xl"
            />
          </Link>
          <div className="flex w-[160px] flex-col">
            <h2 className="text-14 truncate font-semibold text-white-1">
              {dmedia?.title}
            </h2>
            <p className="text-12 font-normal text-white-2">{dmedia?.author}</p>
          </div>
        </div>
        <div className="flex-center cursor-pointer gap-3 md:gap-6">
          <div className="flex items-center gap-1.5">
            <Image
              src={"/icons/reverse.svg"}
              width={24}
              height={24}
              alt="rewind"
              onClick={rewind}
            />
            <h2 className="text-12 font-bold text-white-4">-5</h2>
          </div>
          <Image
            src={isPlaying ? "/icons/Pause.svg" : "/icons/Play.svg"}
            width={30}
            height={30}
            alt="play"
            onClick={togglePlayPause}
          />
          <div className="flex items-center gap-1.5">
            <h2 className="text-12 font-bold text-white-4">+5</h2>
            <Image
              src={"/icons/forward.svg"}
              width={24}
              height={24}
              alt="forward"
              onClick={forward}
            />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <h2 className="text-16 font-normal text-white-2 max-md:hidden">
            {formatTime(duration)}
          </h2>
          <div className="flex w-full gap-2">
            <Image
              src={isMuted ? "/icons/unmute.svg" : "/icons/mute.svg"}
              width={24}
              height={24}
              alt="mute unmute"
              onClick={toggleMute}
              className="cursor-pointer"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default MediaPlayer;
