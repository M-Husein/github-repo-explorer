import { useState, useEffect, useRef, useCallback } from 'react';
import { Button, Select, Slider, Popover  } from 'antd';
import { BsSpeedometer, BsMusicNoteBeamed, BsVolumeUpFill, BsVolumeMuteFill, BsMegaphone, BsStopFill, BsPauseFill } from "react-icons/bs";
import { cx } from '@/utils';

type SpeechContentProps = {
  className?: string
  text?: string | any
}

export const SpeechContent = ({
  className,
  text,
}: SpeechContentProps) => {
  const utteranceRef: any = useRef();
  const divRef: any = useRef();
  const [voice, setVoice] = useState<string>('0');
  const [rateValue, setRateValue] = useState<number>(1);
  const [pitchValue, setPitchValue] = useState<number>(1);
  const [volumeValue, setVolumeValue] = useState<number>(1);
  const [isSpeak, setIsSpeak] = useState<boolean>(false);
  const [isPause, setIsPause] = useState<boolean>(false);

  let speechSyn: any = typeof window !== 'undefined' && window.speechSynthesis;
  const SpeechUtterance: any = typeof window !== 'undefined' && window.SpeechSynthesisUtterance;
  const [voices, setVoices] = useState<SpeechSynthesisVoice[] | undefined | null>(null);

  const populateVoiceList = useCallback(() => {
    if(!!speechSyn && !!SpeechUtterance){
      const optionVoices = speechSyn.getVoices().map((item: any, i: number) => Object.assign(item, { value: '' + i }) );
      setVoices(optionVoices);
    }
  }, []);
  
  useEffect(() => {
    populateVoiceList();

    if(speechSyn && speechSyn.onvoiceschanged !== undefined){
      speechSyn.onvoiceschanged = populateVoiceList;
    }
  }, [populateVoiceList]);

  useEffect(() => {
    const endSpeak = () => {
      setIsSpeak(false);
      setIsPause(false);
    }

    const errorSpeak = (e: any) => {
      if(e.error !== 'interrupted'){
        setIsSpeak(false);
        setIsPause(false);
      }
    }

    // Stop speech when reload page or close tab
    const beforeUnload = () => {
      speechSyn.cancel(); // Stop
    }

    if(utteranceRef.current){
      utteranceRef.current.addEventListener("error", errorSpeak);
      utteranceRef.current.addEventListener("end", endSpeak);
      window.addEventListener("beforeunload", beforeUnload, { capture: true });
    }
    
    return () => {
      utteranceRef.current?.removeEventListener?.("error", errorSpeak);
      utteranceRef.current?.removeEventListener?.("end", endSpeak);
      window.removeEventListener("beforeunload", beforeUnload, { capture: true });
    }
  }, [utteranceRef.current, speechSyn]);

  // Stop speech when unmounted
  useEffect(() => {
    return () => {
      if(utteranceRef.current){
        stopSpeak();
      }
    }
  }, []);

  const voiceOptions = () => Object.entries(
    (voices || []).reduce((acc: any, obj: any) => {
      const key = obj.lang;
      const curGroup = acc[key] ?? [];
      return { ...acc, [key]: [...curGroup, obj] };
    }, {})
  )
  .toSorted((a: any, b: any) => {
    const aname = a[0].toUpperCase();
    const bname = b[0].toUpperCase();
    if (aname < bname) return -1;
    else if (aname == bname) return 0;
    else return +1;
  })
  .map(([key, options]: [string, any]) => ({
    label: key,
    title: key,
    options: options.map((item: any) => ({ label: item.name, value: item.value })),
  }));

  const toggleSpeak = (value?: any) => {
    if(text && window.SpeechSynthesisUtterance){
      if(speechSyn.speaking && !speechSyn.paused){
        speechSyn.pause(); // pause narration
        setIsSpeak(false);
        setIsPause(true);
        return;
      }

      setIsSpeak(true);

      if(speechSyn.paused){
        speechSyn.resume(); // unpause/resume narration
        setIsPause(false);
        return;
      }

      utteranceRef.current = new SpeechUtterance(text);

      utteranceRef.current.rate = rateValue;
      utteranceRef.current.pitch = pitchValue;
      utteranceRef.current.volume = volumeValue;
      utteranceRef.current.voice = (voices || [])[+(value || voice)];

      speechSynthesis.speak(utteranceRef.current);
    }
  }

  const stopSpeak = () => {
    if(speechSyn.speaking){
      speechSyn.cancel(); // stop narration
      setIsSpeak(false);
      setIsPause(false);
    }
  }

  const changeVoice = (val: any) => {
    setVoice(val);

    if(isSpeak){
      stopSpeak(); // Stop
      toggleSpeak(val);
    }
  }

  if(!voices){
    return null;
  }

  return (
    <div ref={divRef} className={cx("flex flex-wrap gap-1", className)}>
      <Select
        className="grow"
        showSearch
        optionFilterProp="label"
        value={voice}
        onChange={changeVoice}
        options={voiceOptions()}
        getPopupContainer={() => divRef.current}
      />

      <Popover
        placement="bottom"
        getPopupContainer={() => divRef.current}
        content={
          <div className="h-43 inline-block">
            <Slider
              vertical
              min={0.5}
              max={2}
              step={0.1}
              value={rateValue}
              onChange={(val) => setRateValue(val)}
            />
          </div>
        }
      >
        <Button title="Speech rate">
          <BsSpeedometer />
        </Button>
      </Popover>

      <Popover
        placement="bottom"
        getPopupContainer={() => divRef.current}
        content={
          <div className="h-43 inline-block">
            <Slider
              vertical
              min={0.5}
              max={2}
              step={0.1}
              value={pitchValue}
              onChange={(val) => setPitchValue(val)}
            />
          </div>
        }
      >
        <Button title="Speech pitch">
          <BsMusicNoteBeamed />
        </Button>
      </Popover>

      <Popover
        placement="bottom"
        getPopupContainer={() => divRef.current}
        content={
          <div className="h-43 inline-block">
            <Slider
              vertical
              min={0}
              max={1}
              step={0.05}
              value={volumeValue}
              onChange={(val) => setVolumeValue(val)}
            />
          </div>
        }
      >
        <Button 
          title="Speech volume" 
          disabled={isSpeak || isPause}
          className={isSpeak || isPause ? "pointer-events-none" : ""}
        >
          {volumeValue === 0 ? <BsVolumeMuteFill /> : <BsVolumeUpFill />}
        </Button>
      </Popover>

      <Button
        title={isSpeak ? 'Pause' : 'Speak'}
        onClick={() => toggleSpeak()}
      >
        {isSpeak ? <BsPauseFill className="align--2px" /> : <BsMegaphone className="align--2px" />}
      </Button>
      
      <Button
        title="Stop speak"
        disabled={!isSpeak}
        onClick={stopSpeak}
      >
        <BsStopFill className="align--2px" />
      </Button>
    </div>
  )
}
