import Head from 'next/head';

const SITE_TITLE = 'npmmirror 镜像站';

type PageTitleProps = {
  title?: string;
};

export default function PageTitle({ title }: PageTitleProps): JSX.Element {
  return (
    <Head>
      <title>{title ? `${title} - ${SITE_TITLE}` : SITE_TITLE}</title>
    </Head>
  );
}
