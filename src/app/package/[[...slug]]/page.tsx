import PageHome from './home'
import PageFiles from './files'
import PageVersions from './versions'
import PageDeps from './deps'
import { redirect } from 'next/navigation';
import 'antd/dist/reset.css';
import styles from './page.module.css';
import CustomTabs from '@/components/CustomTabs';

const PageMap: Record<string, (params: { manifest: any }) => JSX.Element> = {
  home: PageHome,
  deps: PageDeps,
  files: PageFiles,
  versions: PageVersions,
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
  let type;

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

  const version = resData['dist-tags']?.latest;

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>{resData.name}@{version}</div>
      </header>
      <section style={{ paddingLeft: 16 }}>
        <CustomTabs activateKey={type}></CustomTabs>
      </section>
      <main>
        <Component manifest={resData} version={version}/>
      </main>
    </>
  );
}

async function getData(pkgName: string, version = 'latest') {
  const res = await fetch(`https://registry.npmmirror.com/${pkgName}`)
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}
