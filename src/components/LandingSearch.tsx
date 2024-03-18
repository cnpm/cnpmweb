'use client';

import React, { useLayoutEffect, useState } from 'react';
import { Input, Typography, AutoComplete } from 'antd';
import { useCachedSearch } from '@/hooks/useSearch';
import { useRouter } from 'next/router';
import { PackageTag } from './PackageCard';
import { useRecent } from '@/hooks/useRecent';

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

  return (
    <>
      {load && (
        <AutoComplete
          style={{ width: '100%' }}
          options={options}
          autoFocus
          onChange={setSearch}
          onSelect={(search) => router.push(`/package/${search}`, undefined, { shallow: true })}
        >
          <Input.Search
            size="large"
            placeholder="输入 NPM 包名、作者、关键字等信息即可搜索..."
            enterButton
            onSearch={(_, e) => {
              // 点击搜索按钮才进搜索页面
              if (e?.type === 'click') {
                e?.stopPropagation();
                router.push(`/packages?q=${search}`);
              }
            }}
            loading={!!(search && isLoading)}
          />
        </AutoComplete>
      )}
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
