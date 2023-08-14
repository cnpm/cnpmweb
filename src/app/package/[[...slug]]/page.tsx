import PageHome from './home'
import PageFiles from './files'
import PageVersions from './versions'
import PageDeps from './deps'
import { redirect } from 'next/navigation';
import 'antd/dist/reset.css';
import styles from './page.module.css';
import CustomTabs from '@/components/CustomTabs';
import { PackageManifest } from '@/hooks/useManifest';
import { revalidateTag } from 'next/cache';
import { getNeedSync } from '@/initData/getNeedSync';

export type PageProps = {
  manifest: PackageManifest;
  version?: string;
  additionalInfo?: any;
};

const PageMap: Record<string, (params: PageProps) => JSX.Element> = {
  home: PageHome,
  deps: PageDeps,
  files: PageFiles,
  versions: PageVersions,
} as const;

const AdditionalInfo = {
  versions: getNeedSync
};
// 由于路由不支持 @scope 可选参数
// 需要在页面中自行解析
export default async function PackagePage({
  params,
  searchParams,
}: {
  params: { slug: string[] };
  searchParams: { [key: string]: string | string[] | undefined }
}) {

  // 设置页面信息
  const { slug } = params;
  let scope;
  let name;
  let type: keyof typeof PageMap;

  if (slug?.[0].startsWith('%40')) {
    [scope, name, type] = slug;
    scope = decodeURIComponent(scope);
  } else {
    [name, type] = slug || [];
  }

  const Component = PageMap[type];

  const pkgName = scope ? `${scope}/${name}` : name;
  if (!Component) {
    redirect(`/package/${pkgName}/home`);
  }

  const resData = await getData(pkgName, searchParams.version as string);

  const version:string = searchParams.version || resData['dist-tags']?.latest;

  const additionalInfo = AdditionalInfo[type as 'versions']
    ? await AdditionalInfo[type as 'versions'](resData)
    : null;

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          {resData.name}@{version}
        </div>
      </header>
      <section style={{ paddingLeft: 16 }}>
        <CustomTabs activateKey={type} pkg={resData}></CustomTabs>
      </section>
      <main>
        <Component
          manifest={resData}
          version={version}
          additionalInfo={additionalInfo}
        />
      </main>
    </>
  );
}

async function getData(pkgName: string, version = 'latest') {
  const tag = `${pkgName}_manifest`;
  const res = await fetch(
    `https://registry.npmmirror.com/${pkgName}`,
    {
      next: {
        tags: [tag],
      },
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  revalidateTag(tag);
  const data = await res.json();
  return data;
}
