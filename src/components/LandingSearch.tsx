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

    return searchResult.objects.map(
      (object) => ({
        label: (
          <>
            <Typography.Text>
              {object.package.name}@{object.package.version}
            </Typography.Text>
            <br />
            <Typography.Text type='secondary'>
              {object.package.description}
            </Typography.Text>
          </>
        ),
        value: object.package.name,
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
    >
      <Input.Search
        size='large'
        placeholder='输入 NPM 包名、作者、关键字等信息即可搜索...'
        enterButton
        loading={!!(search && isLoading)}
      />
    </AutoComplete>
  );
}
