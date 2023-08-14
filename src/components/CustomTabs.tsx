'use client';
import { Tabs } from 'antd';
import Link from 'next/link';
import AntdStyle from './AntdStyle';
import { useSearchParams } from 'next/navigation';
import NPMVersionSelect from './NPMVersionSelect';
import { PackageManifest } from '@/hooks/useManifest';
import { useRouter } from 'next/navigation';

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
  const params = useSearchParams();
  const { replace } = useRouter();
  return (
    <AntdStyle>
      <Tabs
        activeKey={activateKey}
        type={'line'}
        tabBarExtraContent={
          <NPMVersionSelect
            versions={Object.keys(pkg?.versions || {})}
            tags={pkg?.['dist-tags']}
            targetVersion={params.get('version') || pkg?.['dist-tags']?.latest}
            setVersionStr={(v) => {
              if (v === pkg?.['dist-tags']?.latest) {
                replace(`${activateKey}`);
              } else {
                replace(`${activateKey}?version=${v}`);
              }
            }}
          />
        }
        items={presetTabs.map((tab) => {
          return {
            label: (
              <Link key={tab.key} href={`${tab.key}?${params.toString()}`}>
                {tab.name}
              </Link>
            ),
            key: tab.key,
          };
        })}
      ></Tabs>
    </AntdStyle>
  );
}
