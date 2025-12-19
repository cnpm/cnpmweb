'use client';
import { Flex, Space, Tabs } from 'antd';
import Link from 'next/link';
import NPMVersionSelect from './NPMVersionSelect';
import { PackageManifest } from '@/hooks/useManifest';
import { useRouter } from 'next/router';
import { FileActions } from './FileActions';

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
  {
    name: '下载趋势',
    key: 'trends',
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
        <Flex gap="small" style={{ marginInlineEnd: 16 }}>
          {activateKey === 'files' && <FileActions />}
          <NPMVersionSelect
            versions={Object.keys(pkg?.versions || {})}
            tags={pkg?.['dist-tags']}
            targetVersion={targetVersion}
            setVersionStr={(v) => {
              if (v === pkg?.['dist-tags']?.latest) {
                push(`/package/${pkg.name}/${activateKey}`, undefined, { shallow: true });
              } else {
                push(`/package/${pkg.name}/${activateKey}?version=${v}`, undefined, {
                  shallow: true,
                });
              }
            }}
          />
        </Flex>
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
