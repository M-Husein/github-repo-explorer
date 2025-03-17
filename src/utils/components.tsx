import { Suspense } from 'react';
import { Card } from 'antd';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const lazyComponent = (Element: any, loading?: any) => {
  return (
    <ErrorBoundary>
      <Suspense fallback={loading || <Card loading className="shadow" />}>
        <Element />
      </Suspense>
    </ErrorBoundary>
  )
}
