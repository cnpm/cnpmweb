import { SearchOutlined } from '@ant-design/icons';
import { Col, Input, Row, Space, Tabs } from 'antd';
import React from 'react';
import styles from './SearchBox.module.css';
import { SearchResult } from '@/hooks/useSearch';
import { useRouter } from 'next/router';

export interface SearchBoxProps {
  defaultSearch: string;
  onSearch: (search: string) => void;
  searchResult?: SearchResult;
}

export default function SearchBox({
  defaultSearch,
  onSearch,
  searchResult,
}: SearchBoxProps) {

  return (
    <div style={{ overflow: 'hidden' }}>
      <div style={{ padding: '32px 0' }}>
        <Row gutter={[32, 32]}>
          <Col span={24}>
            <Input.Search
              autoFocus
              placeholder="搜索 NPM 包"
              allowClear
              enterButton={
                <Space>
                  <SearchOutlined />
                  搜索
                </Space>
              }
              size="large"
              defaultValue={defaultSearch}
              onSearch={onSearch}
            />
          </Col>
        </Row>
      </div>
      <div>
        <Tabs
          size="large"
          className={styles.tab}
          activeKey={'npm'}
        >
          <Tabs.TabPane
            key="npm"
            tab={
              <Space size="small">
                搜索结果
                <span className={styles.count}>
                  {(searchResult?.total as number > 9999
                    ? '9999+'
                    : searchResult?.total) ?? '-'}
                </span>
              </Space>
            }
          />
        </Tabs>
      </div>
    </div>
  );
}
