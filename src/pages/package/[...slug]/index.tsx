import PageHome from '@/slugs/home'
import PageFiles from '@/slugs/files'
import PageVersions from '@/slugs/versions'
import PageDeps from '@/slugs/deps'
import 'antd/dist/reset.css';
import styles from './page.module.css';
import CustomTabs from '@/components/CustomTabs';
import { PackageManifest } from '@/hooks/useManifest';
import Footer from '@/components/Footer';
import { useRouter } from 'next/router';
import { isEqual } from 'lodash';

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

// 由于路由不支持 @scope 可选参数
// 需要在页面中自行解析
export default function PackagePage({
  data: resData,
  needSync,
}: {
  data: PackageManifest;
  scope?: string;
  name: string;
  needSync: boolean;
}) {

  const router = useRouter();
  let type =
    (router.asPath.split('?')[0].replace(
      `/package/${resData.name}/`,
      ''
    ) as keyof typeof PageMap);
  const version = (router.query.version as string) || resData?.['dist-tags']?.latest;

  if (PageMap[type] === undefined) {
    type = 'home';
  }

  const Component = PageMap[type];

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
          additionalInfo={needSync}
        />
      </main>
      <Footer/>
    </>
  );
}

export async function getServerSideProps(ctx: any) {
  const slug = ctx.params.slug;

  let scope = null;
  let name;
  let type: keyof typeof PageMap = 'home';

  if (slug.join('/').startsWith('@')) {
    [scope, name, type] = slug;
    scope = decodeURIComponent(scope);
  } else {
    [name, type] = slug || [];
  }

  const pkgName = scope ? `${scope}/${name}` : name;

  const [pkg, sourceRegistryInfo] = await Promise.all([
    fetch(`https://registry.npmmirror.com/${pkgName}`, {
      cache: 'no-store',
    }).then((res) => res.json()),
    fetch(`https://registry.npmjs.org/${pkgName}`, { cache: 'no-store',
      headers: {
        'Accept': 'application/vnd.npm.install-v1+json',
      },
     }).then(
      (res) => res.json()
    ),
  ]);

  // dist-tag 一致，版本也一致，就认为不需要同步
  const alreadySync =
    isEqual(pkg?.['dist-tags'], sourceRegistryInfo?.['dist-tags']) &&
    isEqual(
      Object.keys(pkg?.versions || {}).sort(),
      Object.keys(sourceRegistryInfo?.versions || {}).sort()
    );

  if (!pkg.name) {
    return {
      redirect: {
        destination: '/500',
        permanent: false,
      },
    };
  }


  // 剪裁一下 pkg 的数据
  const {
    versions,
    maintainers = null,
    repository = null,
  } = pkg as PackageManifest;
  const simpleVersions: Record<string, Partial<PackageManifest['versions'][string]>> = {};

  Object.entries(versions).forEach(([version, data]) => {
    simpleVersions[version] = {
      version: data.version,
      dist: {
        tarball: data?.dist?.tarball || '',
        size: data?.dist?.size || '0',
      },
      publish_time: data.publish_time || 0,
      _npmUser: data._npmUser,
    };
  });
  const data = {
    name,
    maintainers,
    repository,
    'dist-tags': pkg['dist-tags'],
    versions: simpleVersions,
  };


  return { props: { data, scope, name, needSync: !alreadySync } };
}
