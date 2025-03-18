import { Suspense } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { SplashScreen } from '@/components/SplashScreen';

export const lazyComponent = (Element: any, loading?: any) => (
  <ErrorBoundary>
    <Suspense fallback={loading || <SplashScreen />}>
      <Element />
    </Suspense>
  </ErrorBoundary>
);

