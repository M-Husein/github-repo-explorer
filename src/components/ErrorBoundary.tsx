import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import type { ReactNode, ErrorInfo } from 'react';
import { Result, Button } from 'antd';
import { useNavigation } from "@refinedev/core";

interface ErrorBoundaryProps {
  children?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export function ErrorBoundary({
  children,
  onError,
}: ErrorBoundaryProps){
  return (
    <ReactErrorBoundary
      FallbackComponent={Fallback}
      onError={onError}
    >
      {children}
    </ReactErrorBoundary>
  )
}

function Fallback({ resetErrorBoundary }: any){
  const { push } = useNavigation();
  const rootRoute = ['/', '/home'];

  const backTo = () => {
    push("/");
  }

  return (
    <Result
      status="warning"
      title="Something went wrong"
      subTitle={!navigator.onLine && "No internet connection"}
      extra={
        <>
          <Button onClick={resetErrorBoundary}>Try again</Button>
          {' '}
          {!rootRoute.includes(window.location.pathname) && (
            <Button
              ghost
              type="primary"
              onClick={backTo}
            >
              Back to Home
            </Button>
          )}
        </>
      }
    />
  );
}
