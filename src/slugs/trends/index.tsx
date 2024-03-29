'use client';
import SizeContainer from '@/components/SizeContainer';
import { Card,  Select, Typography } from 'antd';
import React, { useState } from 'react';
import { PageProps } from '@/pages/package/[...slug]';
import { TotalDownloads } from '@/components/RecentDownloads';
import { useCachedSearch } from '@/hooks/useSearch';
import { DownOutlined } from '@ant-design/icons';

const MAX_COUNT = 5;

export default function Trends({ manifest: pkg, additionalInfo: needSync, version }: PageProps) {
  const [search, setSearch] = useState('');
  const [pkgs, setPkgs] = useState([pkg.name]);
  const { data: searchResult, isLoading } = useCachedSearch({
    keyword: search,
    page: 1,
  });

  const suffix = (
    <>
      <span>
        {pkgs.length} / {MAX_COUNT}
      </span>
      <DownOutlined />
    </>
  );

  return (
    <>
      <SizeContainer maxWidth={1072}>
        <Select
          mode="multiple"
          maxCount={MAX_COUNT}
          value={pkgs}
          style={{ width: '100%' }}
          onSearch={setSearch}
          suffixIcon={suffix}
          placeholder="Please select"
          defaultValue={pkgs}
          onChange={setPkgs}
          options={searchResult?.objects.map((object) => ({
            label: (
              <>
                <Typography.Text>
                  {object.package.name}
                </Typography.Text>
                <br />
              </>
            ),
            value: object.package.name,
          }))}
        />
        <Card style={{ marginTop: 24 }}>
          <TotalDownloads pkgNameList={pkgs}/>
        </Card>
      </SizeContainer>
    </>
  );
}
