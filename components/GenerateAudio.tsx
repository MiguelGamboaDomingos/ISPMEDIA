import { GenerateAudioProps } from '@/types'
import React, { useState } from 'react'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Loader } from 'lucide-react'
import { useAction, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/components/ui/use-toast"

import { useUploadFiles } from '@xixixao/uploadstuff/react';

const useGenerateAudio = ({
  setAudio, voiceType, voicePrompt, setAudioStorageId
}: GenerateAudioProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast()

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl)

  const getPodcastAudio = useAction(api.openai.generateAudioAction)

  const getAudioUrl = useMutation(api.medias.getUrl);

  const generateAudio = async () => {
    setIsGenerating(true);
    setAudio('');

    if(!voicePrompt) {
      toast({
        title: "Escolha uma voz para poder gerar o audio",
      })
      return setIsGenerating(false);
    }

    try {
      const response = await getPodcastAudio({
        voice: voiceType,
        input: voicePrompt
      })

      const blob = new Blob([response], { type: 'audio/mpeg' });
      const fileName = `media-${uuidv4()}.mp3`;
      const file = new File([blob], fileName, { type: 'audio/mpeg' });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      setAudioStorageId(storageId);

      const audioUrl = await getAudioUrl({ storageId });
      setAudio(audioUrl!);
      setIsGenerating(false);
      toast({
        title: "Audio gerado com sucesso!",
      })
    } catch (error) {
      console.log('Erro ao gerar audio', error)
      toast({
        title: "Erro ao criar o audio",
        variant: 'destructive',
      })
      setIsGenerating(false);
    }
    
  }

  return { isGenerating, generateAudio }
}

const GenerateAudio = (props: GenerateAudioProps) => {
  const { isGenerating, generateAudio } = useGenerateAudio(props);

  return (
    <div>
      <div className="flex flex-col gap-2.5">
        <Label className="text-16 font-bold text-white-1">
          Texto para gerar imagem
        </Label>
        <Textarea 
          className="input-class font-light focus-visible:ring-offset-orange-1"
          placeholder='Provide text to generate audio'
          rows={5}
          value={props.voicePrompt}
          onChange={(e) => props.setVoicePrompt(e.target.value)}
        />
      </div>
      <div className="mt-5 w-full max-w-[200px]">
      <Button type="submit" className="text-16 bg-orange-1 py-4 font-bold text-white-1" onClick={generateAudio}>
        {isGenerating ? (
          <>
            Gerando...
            <Loader size={20} className="animate-spin ml-2" />
          </>
        ) : (
          'Gerar'
        )}
      </Button>
      </div>
      {props.media && (
        <audio 
          controls
          src={props.media}
          autoPlay
          className="mt-5"
          onLoadedMetadata={(e) => props.setMediaDuration(e.currentTarget.duration)}
        />
      )}
    </div>
  )
}

export default GenerateAudio