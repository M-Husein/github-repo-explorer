import { useRef, useState, useEffect } from 'react';
import { Button, Input, Tooltip } from 'antd';
import { AudioOutlined } from '@ant-design/icons';

type FormSearchProps = {
  loading?: boolean,
  value?: string,
  size?: string,
  className?: string,
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onSearch?: (e: any) => void,
  onSpeechEnd?: (value: string) => void,
}

export const FormSearch = ({
  loading,
  value,
  onChange,
  onSearch,
  onSpeechEnd,
}: FormSearchProps) => {
  const recognition = useRef(null) as any;
  const [isEnabled, setIsEnabled] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState<boolean>(false);
  const [noRender, setNoRender] = useState<boolean>(true);
  const [openTooltip, setOpenTooltip] = useState<boolean>(false);

  useEffect(() => {
    setNoRender(false);
  }, []);

  useEffect(() => {
    const isSupported = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
    setSpeechRecognition(isSupported);

    if(isSupported && isEnabled && recognition.current === null){ // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      recognition.current = new SpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;

      recognition.current.addEventListener('result', (e: any) => {
        const resultItem = e.results.item(e.resultIndex);
        const { transcript } = resultItem.item(0);

        if(!resultItem.isFinal){
          return;
        }

        recognition.current.stop();
        setIsEnabled(false);
        onSpeechEnd?.(transcript);

        // onChange?.(transcript);
        onSearch?.(transcript);
      });
    }

    if(recognition.current){
      isEnabled ? recognition.current.start() : recognition.current.stop();
    }

    return () => {
      if(recognition.current !== null){
        recognition.current.stop();
      }
    }
  }, [isEnabled, onSpeechEnd]);

  const toggleSpeak = (e: React.MouseEvent<HTMLButtonElement>) => {
    if(isEnabled){
      (e.target as any).blur();
    }
    setIsEnabled(!isEnabled);
  }

  if(noRender){
    return null;
  }

  return (
    <Input.Search
      allowClear
      size="large"
      loading={loading}
      placeholder="Search by username"
      classNames={{
        suffix: "-mr-2"
      }}
      suffix={
        speechRecognition && (
          <Tooltip 
            open={isEnabled || openTooltip}
            placement="bottomRight"
            title={loading ? '' : isEnabled ? 'Stop' : 'Search by voice'}
            onOpenChange={setOpenTooltip}
          >
            <Button
              danger={isEnabled}
              type={isEnabled ? "primary" : "text"}
              icon={<AudioOutlined  />}
              style={{ width: 32 }}
              disabled={loading}
              onClick={toggleSpeak}
            >
              {isEnabled && <i className="animate-ping absolute inset-0 inline-flex h-full w-full rounded-full bg-red-300 pointer-events-none" />}
            </Button>
          </Tooltip>
        )
      }
      value={value}
      onChange={onChange}
      onSearch={onSearch}
    />
  );
}
