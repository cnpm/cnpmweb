'use client';

import React, { useState } from 'react';
import { Input, Typography, AutoComplete } from 'antd';
import { useCachedSearch } from '@/hooks/useSearch';
import { useRouter } from 'next/router';

export default function LandingSearch() {
  const [search, setSearch] = useState('');
  const router = useRouter();
  const jumpRef = React.useRef(false);

  const { data: searchResult, isLoading } = useCachedSearch({
    keyword: search,
    page: 0,
  });

  const options = React.useMemo(() => {
    if (!searchResult) {
      return [];
    }

    return searchResult.hits.map(
      (hit: { name: string; version: string; description: string }) => ({
        label: (
          <>
            <Typography.Text>
              {hit.name}@{hit.version}
            </Typography.Text>
            <br />
            <Typography.Text type='secondary'>
              {hit.description}
            </Typography.Text>
          </>
        ),
        value: hit.name,
      })
    );
  }, [searchResult]);

  return (
    <AutoComplete
      style={{ width: '100%' }}
      options={options}
      onChange={setSearch}
      onSelect={(selectValue) => {
        const targetUrl = `/package/${selectValue}/home`;
        if (targetUrl) {
          jumpRef.current = true;
          router.push(targetUrl);
        }
      }}
      onKeyDown={(e) => {
        if (e.code === '13') {
          setTimeout(() => {
            if (!jumpRef.current) {
              router.push('/packages');
            }
          }, 100);
        }
      }}
    >
      <Input.Search
        size='large'
        placeholder='搜索服务由 Algolia 提供...'
        enterButton
        loading={!!(search && isLoading)}
      />
    </AutoComplete>
  );
}
