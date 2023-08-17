import { ThemeMode, ThemeProvider as _ThemeProvider } from 'antd-style';
import PageHome from '@/slugs/home'
import PageFiles from '@/slugs/files'
import PageVersions from '@/slugs/versions'
import PageDeps from '@/slugs/deps'
import 'antd/dist/reset.css';
import CustomTabs from '@/components/CustomTabs';
import { PackageManifest, useInfo } from '@/hooks/useManifest';
import Footer from '@/components/Footer';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { Result, Spin } from 'antd';
import Header from '@/components/Header';

const ThemeProvider = _ThemeProvider as any;

const LOCAL_STORAGE_THEME = 'themeMode';

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

  const [themeMode, setThemeMode] = useState<ThemeMode>('light');

  useEffect(() => {
    const themeMode = localStorage.getItem(LOCAL_STORAGE_THEME) as ThemeMode;
    if (themeMode) {
      setThemeMode(themeMode);
    }
  }, []);

  useEffect(() => {
    document
      .querySelector('html')
      ?.setAttribute('style', `color-scheme: ${themeMode};`);
  }, [themeMode]);

  const pkgName = useMemo(() => {
    const { slug } = router.query;
    if (!slug) {
      return '';
    }
    let pathGroups = [];
    if (typeof slug === 'string') {
      pathGroups = [slug];
    } else {
      pathGroups = [...slug];
    }
    return getPkgName(pathGroups);
  }, [router.query]);

  const { data, isLoading, error } = useInfo(pkgName);

  const resData = data?.data;
  const needSync = data?.needSync;

  if (error) {
    return <Result status='error' title='Error' subTitle={error.message} />;
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

  let type = router.asPath
    .split('?')[0]
    .replace(`/package/${resData.name}/`, '') as keyof typeof PageMap;
  const version =
    (router.query.version as string) || resData?.['dist-tags']?.latest;

  if (PageMap[type] === undefined) {
    type = 'home';
  }

  const Component = PageMap[type];

  return (
    <div>
      <ThemeProvider themeMode={themeMode}>
        <Header
          title={`${resData.name}@${version}`}
          themeMode={themeMode}
          setThemeMode={(v: ThemeMode) => {
            localStorage.setItem(LOCAL_STORAGE_THEME, v);
            setThemeMode(v);
          }}
        />
        <section style={{ paddingLeft: 16 }}>
          <CustomTabs activateKey={type} pkg={resData}></CustomTabs>
        </section>
        <main style={{ minHeight: 'calc( 100vh - 110px )' }}>
          <Component
            manifest={resData}
            version={version}
            additionalInfo={needSync}
          />
        </main>
        <Footer />
      </ThemeProvider>
    </div>
  );
}
