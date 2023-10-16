import { ThemeProvider as _ThemeProvider } from 'antd-style';
import PageHome from '@/slugs/home'
import PageFiles from '@/slugs/files'
import PageVersions from '@/slugs/versions'
import PageDeps from '@/slugs/deps'
import 'antd/dist/reset.css';
import CustomTabs from '@/components/CustomTabs';
import { PackageManifest, useInfo, useSpec } from '@/hooks/useManifest';
import Footer from '@/components/Footer';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { Result, Spin } from 'antd';
import Header from '@/components/Header';
import { useTheme } from '@/hooks/useTheme';
import AdHire from '@/components/AdHire';

const DEFAULT_TYPE = 'home';
const ThemeProvider = _ThemeProvider as any;

export type PageProps = {
  manifest: PackageManifest;
  version?: string;
  additionalInfo?: any;
};

function getPkgName(pathGroups: string[]) {

  let [scope, name] = pathGroups;
  if (!name) {
    name = scope;
    scope = '';
  }


  if (!name || name.startsWith('@')) {
    return undefined;
  }

  if (scope && !scope.startsWith('@')) {
    return scope;
  }

  return scope ? `${scope}/${name}` : name;
}

function getPageType(pathGroups: string[]) {
  let [scope, name, type] = pathGroups;

  if (!scope?.startsWith('@')) {
    // [antd, home]
    // [antd]
    type = name;
    name = scope;
  }

  // invalid
  // [@antd, home]
  if (!PageMap[type]) {
    return DEFAULT_TYPE;
  }

  return type;

}

const PageMap: Record<string, (params: PageProps) => JSX.Element> = {
  home: PageHome,
  deps: PageDeps,
  files: PageFiles,
  versions: PageVersions,
} as const;

// 由于路由不支持 @scope 可选参数
// 需要在页面中自行解析
export default function PackagePage({
}: {
}) {
  const router = useRouter();

  const [themeMode, setThemeMode] = useTheme();

  const [pkgName, type = DEFAULT_TYPE] = useMemo(() => {
    const { slug } = router.query;
    if (!slug) {
      return [];
    }
    let pathGroups = [];
    if (typeof slug === 'string') {
      pathGroups = [slug];
    } else {
      pathGroups = [...slug];
    }
    return [getPkgName(pathGroups), getPageType(pathGroups)];
  }, [router.query]);


  const routerVersion = router.query.version as string;
  const { data, isLoading, error } = useInfo(pkgName);
  const { data: specInfo } = useSpec(pkgName, routerVersion, data?.data);

  const resData = data;
  const specVersion = specInfo?.version;
  const needSync = data?.needSync;

  if (error) {
    return <Result status='error' title='Error' subTitle={error?.message || '系统错误'} />;
  }


  if (isLoading || !resData?.name) {
    return (
      <Spin
        style={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
    );
  }

  // patchVersion
  if (routerVersion && specVersion && router.query.version !== specVersion) {
    router.replace({
      pathname: router.pathname,
      query: {
        slug: router.query.slug,
        version: specVersion,
      },
    }, undefined, { shallow: true });
    return <></>;
  }

  const Component = PageMap[type];

  const version = routerVersion || specInfo?.version || resData?.['dist-tags']?.latest;

  return (
    <div>
      <ThemeProvider themeMode={themeMode}>
        <AdHire />
        <Header
          title={`${resData.name}@${version}`}
          themeMode={themeMode}
          setThemeMode={setThemeMode}
        />
        <section style={{ paddingLeft: 16 }}>
          <CustomTabs activateKey={type!} pkg={resData}></CustomTabs>
        </section>
        <main style={{ minHeight: 'calc( 100vh - 110px )' }}>
          <Component manifest={resData} version={version} additionalInfo={needSync} />
        </main>
        <Footer />
      </ThemeProvider>
    </div>
  );
}
