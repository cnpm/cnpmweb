'use client';
import { Tabs } from 'antd';
import Link from 'next/link';
import NPMVersionSelect from './NPMVersionSelect';
import { PackageManifest } from '@/hooks/useManifest';
import { useRouter } from 'next/router';

const presetTabs = [
  {
    name: '首页',
    key: 'home',
  },
  {
    name: '产物预览',
    key: 'files',
  },
  {
    name: '依赖信息',
    key: 'deps',
  },
  {
    name: '版本列表',
    key: 'versions',
  },
];

export default function CustomTabs({
  activateKey,
  pkg,
}: {
  activateKey: string;
  pkg: PackageManifest;
}) {
  const { push, query } = useRouter();
  const routerVersion = query.version as string;
  const targetVersion = routerVersion || pkg?.['dist-tags']?.latest;

  return (
    <Tabs
      activeKey={activateKey}
      type={'line'}
      tabBarExtraContent={
        <NPMVersionSelect
          versions={Object.keys(pkg?.versions || {})}
          tags={pkg?.['dist-tags']}
          targetVersion={targetVersion}
          setVersionStr={(v) => {
            if (v === pkg?.['dist-tags']?.latest) {
              push(`/package/${pkg.name}/${activateKey}`, undefined, { shallow: true });
            } else {
              push(`/package/${pkg.name}/${activateKey}?version=${v}`, undefined, { shallow: true });
            }
          }}
        />
      }
      items={presetTabs.map((tab) => {
        return {
          label: (
            <Link
              key={tab.key}
              shallow
              href={
                routerVersion
                  ? `/package/${pkg.name}/${tab.key}?version=${targetVersion}`
                  : `/package/${pkg.name}/${tab.key}`
              }
            >
              {tab.name}
            </Link>
          ),
          key: tab.key,
        };
      })}
    ></Tabs>
  );
}
