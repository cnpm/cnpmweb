'use client';
import type { TableColumnsType } from 'antd';
import { Card, Col, Row, Table } from 'antd';
import React from 'react';
import SizeContainer from "@/components/SizeContainer";
import Link from "next/link";
import { PageProps } from '@/pages/package/[...slug]';
import { useFileContent } from '@/hooks/useFile';

const columns: TableColumnsType<object> = [
  {
    title: '名称',
    dataIndex: 'package',
    render: (pkg: string) => {
      return (
        <Link href={`/package/${pkg}`} target="_blank">
          {pkg}
        </Link>
      );
    },
  },
  {
    title: '版本范围',
    dataIndex: 'spec',
  },
];

export default function Deps({ manifest: pkg, version }: PageProps) {
  const {data: versionManifest, isLoading } = useFileContent(
    { fullname: pkg.name, spec: version },
    '/package.json'
  );
  const depsInfo = React.useMemo(() => {
    if (isLoading) return undefined;
    const targetVersion = JSON.parse(versionManifest || '{}');
    const deps = ['dependencies', 'devDependencies'] as const;
    const res: Record<string, { package: string; spec: string }[]> = {
      dependencies: [],
      devDependencies: [],
    };
    deps.forEach((k) => {
      if (targetVersion?.[k]) {
        res[k] = Object.keys(targetVersion[k] || {}).map((pkg) => ({
          package: pkg,
          spec: targetVersion[k][pkg],
        }));
      }
    });
    return res;
  }, [versionManifest, isLoading]);

  const loading = depsInfo === undefined;

  const { dependencies = [], devDependencies = [] } = depsInfo || {};

  return (
    <SizeContainer maxWidth='90%'>
      <Row gutter={[8, 8]}>
        <Col span={12}>
          <Card
            title={`Dependencies (${loading ? '-' : dependencies.length})`}
            loading={loading}
          >
            <Table
              dataSource={dependencies}
              rowKey={'package'}
              columns={columns}
              pagination={{ size: 'small' }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title={`DevDependencies (${
              loading ? '-' : devDependencies.length
            })`}
            loading={loading}
          >
            <Table
              dataSource={devDependencies}
              columns={columns}
              rowKey={'package'}
              pagination={{ size: 'small' }}
            />
          </Card>
        </Col>
      </Row>
    </SizeContainer>
  );
}
