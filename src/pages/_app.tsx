import { AppProps } from 'next/app';
import Head from 'next/head';
import PageTitle from '@/components/PageTitle';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageTitle />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
