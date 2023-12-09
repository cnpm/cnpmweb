import React from 'react';
import 'antd/dist/reset.css';
import Footer from '@/components/Footer';
import { ThemeMode, ThemeProvider as _ThemeProvider } from 'antd-style';
import Header from '@/components/Header';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'next/router';
import SearchBox from '@/components/SearchBox';
import SizeContainer from '@/components/SizeContainer';
import { SearchItem, useCachedSearch } from '@/hooks/useSearch';
import { Col, Empty, Pagination, Row, Space } from 'antd';
import { PackageCard } from '@/components/PackageCard';

const ThemeProvider = _ThemeProvider as any;

type PageType = {
  page: number;
  q: string;
};

const LOAD_PACKAGES: SearchItem[] = new Array(12).fill({
  package: {
    name: '',
    version: '',
  },
});

export default function Packages({ page: initPage, q: initQ }: PageType) {
  // 统一通过 router.query.q 获取搜索词
  // initQ 和 initPage 是分页关键词
  const router = useRouter();
  const {
    query: { q = initQ, page = initPage },
  } = router;

  const [themeMode, setThemeMode] = useTheme();

  const { data: searchResult, isLoading } = useCachedSearch({
    keyword: q as string,
    page: Number(page || 1),
  });

  return (
    <ThemeProvider themeMode={themeMode as ThemeMode}>
      <Header themeMode={themeMode} setThemeMode={setThemeMode} />
      <SizeContainer maxWidth={800}>
        <SearchBox
          defaultSearch={q as string}
          searchResult={searchResult}
          onSearch={(search) => {
            // 重置分页信息
            router.replace(`${router.pathname}?q=${search}`, undefined, {
              shallow: true,
            });
          }}
        ></SearchBox>

        <Space direction="vertical" style={{ width: '100%', marginBottom: 24 }} size="middle">
          <Row gutter={[0, 16]}>
            {((searchResult?.total || isLoading) as number) > 0 ? (
              (searchResult?.objects || LOAD_PACKAGES)?.map((item, index) => {
                return (
                  <Col span={24} key={index}>
                    <PackageCard
                      themeMode={themeMode as ThemeMode}
                      loading={isLoading}
                      package={item.package}
                      key={item.package?.name || index}
                    />
                  </Col>
                );
              })
            ) : (
              <Empty
                style={{ width: '100%', marginTop: 64 }}
                description={q ? '正在努力查询...' : '输入一个关键词试试吧'}
              />
            )}
          </Row>

          {/* 分页器 */}
          {(searchResult?.total as number) > 12 && (
            <Pagination
              current={Number(page || 1)}
              total={Math.min(searchResult?.total as number, 9999 - 12)}
              pageSize={12}
              showSizeChanger={false}
              onChange={(newPage) => {
                router.replace(`${router.pathname}?q=${q}&page=${newPage}`, undefined, {
                  shallow: true,
                });
              }}
            />
          )}
        </Space>
      </SizeContainer>
      <Footer />
    </ThemeProvider>
  );
}
