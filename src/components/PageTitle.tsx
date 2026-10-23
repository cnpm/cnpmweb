import Head from 'next/head';

const SITE_TITLE = 'npmmirror 镜像站';

export default function PageTitle({ title }: { title?: string }) {
  return (
    <Head>
      <title>{title ? `${title} - ${SITE_TITLE}` : SITE_TITLE}</title>
    </Head>
  );
}
