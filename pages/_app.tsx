import { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/react';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics debug={process.env.NODE_ENV === 'development'} />
    </>
  );
} 