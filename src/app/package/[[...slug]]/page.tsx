import PageVersions from './versions'
import PageDeps from './deps'
import PageHome from './home'
import PageFiles from './files'
import { redirect } from 'next/navigation';

const PageMap: Record<string, () => JSX.Element> = {
  home: PageHome,
  deps: PageDeps,
  files: PageFiles,
  versions: PageVersions,
};
// 由于路由不支持 @scope 可选参数
// 需要在页面中自行解析
export default async function PackagePage({
  params,
}: {
  params: { slug: string[] };
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

  const resData = await getData(pkgName);

  return (
    <>
      <header>我是一个可爱的导航头</header>
      <main>
        我是一些 tabs 信息
        <Component/>
        <code>{JSON.stringify(resData['dist-tags'], null, 2)}</code>
      </main>
    </>
  );
}


async function getData(pkgName: string, version = 'latest') {
  const res = await fetch(`https://registry.npmmirror.com/${pkgName}`)
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  // Recommendation: handle errors
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }

  return res.json()
}
