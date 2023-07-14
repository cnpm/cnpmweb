'use client';
import { Tabs } from 'antd';
import Link from 'next/link';
import AntdStyle from './AntdStyle';

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

export default function CustomTabs({ activateKey }: { activateKey: string }) {
  return (
    <AntdStyle>
      <Tabs
        activeKey={activateKey}
        type={'line'}
        items={presetTabs.map((tab) => {
          return {
            label: (
              <Link key={tab.key} href={tab.key}>
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
