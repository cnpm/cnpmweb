'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import { Typography, Space, Select, Button, ConfigProvider, Spin } from 'antd';
import { useCachedSearch } from '@/hooks/useSearch';
import { useRouter } from 'next/router';
import { PackageTag } from './PackageCard';
import { useRecent } from '@/hooks/useRecent';
import { SearchOutlined } from '@ant-design/icons';

export default function LandingSearch() {
  const [search, setSearch] = useState('');
  const [recent, setRecent] = useRecent();
  const router = useRouter();
  const [load, setLoad] = useState(false);
  useLayoutEffect(() => {
    setLoad(true);
  }, []);

  const { data: searchResult, isLoading } = useCachedSearch({
    keyword: search,
    page: 1,
  });

  const options = React.useMemo(() => {
    if (!searchResult?.objects) {
      return [];
    }

    return searchResult.objects.map((object) => ({
      label: (
        <>
          <Typography.Text>
            {object.package.name}@{object.package.version}
          </Typography.Text>
          <br />
          <Typography.Text type="secondary">{object.package.description}</Typography.Text>
        </>
      ),
      value: object.package.name,
    }));
  }, [searchResult]);
  const searchRef = useRef('');

  return (
    <>
      <ConfigProvider componentSize="large">
        {load && (
          <Space.Compact style={{ width: '100%' }}>
            <Select
              showSearch
              value={null}
              suffixIcon={null}
              onSearch={setSearch}
              autoFocus
              onChange={(search) => router.push(`/package/${search}`)}
              onBlur={() => {
                searchRef.current = search;
              }}
              notFoundContent={isLoading ? <Spin /> : null}
              style={{ width: '100%', textAlign: 'left' }}
              options={options}
              placeholder="输入 NPM 包名、作者、关键字等信息即可搜索..."
            />
            <Button type="primary" onClick={() => router.push(`/packages?q=${searchRef.current}`)}>
              <SearchOutlined />
            </Button>
          </Space.Compact>
        )}
      </ConfigProvider>
      <div style={{ marginTop: 16 }}>
        {recent && (
          <PackageTag
            tags={recent.map((item) => ({
              label: item,
              href: `/${item}`,
            }))}
            closeIcon
            onClose={(v) => {
              setRecent(recent.filter((i) => i !== v));
            }}
          />
        )}
      </div>
    </>
  );
}
