'use client';

import React, { useState } from 'react';
import { Input, Typography, AutoComplete } from 'antd';
import { useCachedSearch } from '@/hooks/useSearch';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function LandingSearch() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const { data: searchResult, isLoading } = useCachedSearch({
    keyword: search,
    page: 1,
  });

  const options = React.useMemo(() => {
    if (!searchResult?.objects) {
      return [];
    }

    return searchResult.objects.map(
      (object) => ({
        label: (
          <Link href={`/package/${object.package.name}`}>
            <Typography.Text>
              {object.package.name}@{object.package.version}
            </Typography.Text>
            <br />
            <Typography.Text type='secondary'>
              {object.package.description}
            </Typography.Text>
          </Link>
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
    >
      <Input.Search
        size='large'
        placeholder='输入 NPM 包名、作者、关键字等信息即可搜索...'
        enterButton
        onSearch={() => {
          router.push(`/packages?q=${search}`)
        }}
        loading={!!(search && isLoading)}
      />
    </AutoComplete>
  );
}
