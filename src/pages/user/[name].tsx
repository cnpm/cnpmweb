import React from 'react';
import 'antd/dist/reset.css';
import Footer from '@/components/Footer';
import { ThemeMode, ThemeProvider as _ThemeProvider } from 'antd-style';
import Header from '@/components/Header';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'next/router';
import useUser from '@/hooks/useUser';
import { Card, Col, Row, Space, Spin, Table, TableColumnsType, Typography } from 'antd';
import SizeContainer from '@/components/SizeContainer';
import { Gravatar } from '@/components/Gravatar';
import Link from 'next/link';

const ThemeProvider = _ThemeProvider as any;

export default function Home() {
  const [themeMode, setThemeMode] = useTheme();
  const { query } = useRouter();

  const {data: resData, isLoading} = useUser(query.name as string | undefined);

  if (isLoading) {
    return (
      <Spin
        style={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
    );
  }

  const columns: TableColumnsType = [
    {
      title: '包名',
      dataIndex: 'name',
      key: 'name',
      onCell: () => ({
        style: {
          maxWidth: 0,
        },
      }),
      render: (title: string) => {
        return (
          <>
            <div>{title}</div>
          </>
        );
      },
    },
    {
      width: 200,
      align: 'center',
      key: 'name',
      render: (_, name: any) => {
        return (
          <Space size="middle">
            <Link href={`/${name.name}`} target='_blank'>查看</Link>
          </Space>
        );
      },
    },
  ];

  return (
    <ThemeProvider themeMode={themeMode as ThemeMode}>
      <Header themeMode={themeMode} setThemeMode={setThemeMode} />
      <main style={{ minHeight: 'calc( 100vh - 110px )' }}>
        <SizeContainer maxWidth={1184}>
          <Row gutter={16} style={{ width: 1184 }}>
            <Col flex="none">
              <Card style={{ width: 280, textAlign: 'center' }}>
                <Gravatar
                  email={resData?.user.email || ''}
                  name={resData?.user?.name || ''}
                  link={false}
                  size={64}
                />
                <Typography.Title level={4} style={{ marginTop: 16 }} ellipsis={{ tooltip: true }}>
                  {resData?.user.name}
                </Typography.Title>
                <Typography.Text>{resData?.user.email}</Typography.Text>
              </Card>
            </Col>
            <Col flex="auto" style={{ width: 0 }}>
              <Card title={'TA 管理的'}>
                <Table
                  loading={isLoading}
                  dataSource={resData?.pkgs}
                  columns={columns as any}
                  rowKey={'name'}
                  pagination={{ showSizeChanger: (resData?.pkgs || []).length > 10 }}
                />
              </Card>
            </Col>
          </Row>
        </SizeContainer>
      </main>
      <Footer />
    </ThemeProvider>
  );
}
