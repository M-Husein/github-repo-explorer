import { useEffect, useState } from 'react';
import { PrismAsync } from 'react-syntax-highlighter'; //  | OPTION: Prism
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'; // OPTION theme: materialLight, materialDark
import { Button } from 'antd';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';
import { useMode } from "@/contexts/color-mode";
import { cx } from '@/utils';

export const CodeView = ({
  language,
  children,
  prefixClass = "relative",
  ...etc
}: any) => {
  const { mode } = useMode();
  const [noRender, setNoRender] = useState<boolean>(true);
  const [copyMessage, setCopyMessage] = useState<boolean>(false);

  useEffect(() => {
    setNoRender(false);
  }, []);

  const copyToClipboard = async () => {
    if(!copyMessage){
      try {
        await navigator?.clipboard?.writeText?.(Array.isArray(children) ? children.join('') : children);
        setCopyMessage(true);
        setTimeout(() => {
          setCopyMessage(false);
        }, 3e3);
      } catch {
        //
      }
    }
  }

  if(noRender){
    return null;
  }

  return (
    <div className={cx(prefixClass, etc.className, !copyMessage && "hide-child")}>
      <Button
        size="small"
        className="chide absolute! top-1 right-1 z-1"
        tabIndex={-1}
        aria-label="Copy to clipboard"
        disabled={copyMessage}
        onClick={copyToClipboard}
      >
        {copyMessage ? <CheckOutlined /> : <CopyOutlined />}
      </Button>

      <PrismAsync
        language={language}
        PreTag="div"
        style={mode === 'dark' ? oneDark : oneLight}
        showLineNumbers={language !== 'bash'}
        {...etc}
      >
        {('' + children).replace(/\n$/, '')}
      </PrismAsync>
    </div>
  );
}
