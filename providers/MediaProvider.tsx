'use client';

import { DMediaContextType, DMediaProps } from "@/types";
import { usePathname } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

const DMediaContext = createContext<DMediaContextType | undefined>(undefined);

const dMediaUrl = ({ children }: { children: React.ReactNode }) => {
  const [dmedia, setDMedia] = useState<DMediaProps | undefined>()
  const pathname = usePathname();

  useEffect(() => {
    if(pathname === '/create-media') setDMedia(undefined);
  }, [pathname])

  return (
    <DMediaContext.Provider value={{ dmedia, setDMedia}}>
      {children}
    </DMediaContext.Provider>
  )
}

export const useDMedia = () => {
  const context = useContext(DMediaContext);

  if(!context) throw new Error('useMedia must be used within an MediaProvider');

  return context;
}

export default dMediaUrl;