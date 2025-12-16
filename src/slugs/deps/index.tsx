'use client';
import type { TableColumnsType } from 'antd';
import { Card, Col, Row, Table } from 'antd';
import React from 'react';
import SizeContainer from '@/components/SizeContainer';
import Link from 'next/link';
import { PageProps } from '@/pages/package/[...slug]';

interface DepRecord {
  package: string;
  spec: string;
}

const columns: TableColumnsType<DepRecord> = [
  {
    title: '名称',
    dataIndex: 'package',
    render: (pkg: string, record: DepRecord) => {
      return (
        <Link href={`/package/${pkg}?version=${encodeURIComponent(record.spec)}`} target="_blank">
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

export default function Deps({ manifest, version }: PageProps) {
  const depsInfo = React.useMemo(() => {
    const versionData = manifest.versions?.[version!];
    if (!versionData) return { dependencies: [], devDependencies: [] };

    const deps = versionData.dependencies || {};
    const devDeps = versionData.devDependencies || {};

    return {
      dependencies: Object.entries(deps).map(([pkg, spec]) => ({
        package: pkg,
        spec,
      })),
      devDependencies: Object.entries(devDeps).map(([pkg, spec]) => ({
        package: pkg,
        spec,
      })),
    };
  }, [manifest, version]);

  const { dependencies, devDependencies } = depsInfo;

  return (
    <SizeContainer maxWidth="90%">
      <Row gutter={[8, 8]}>
        <Col span={12}>
          <Card title={`Dependencies (${dependencies.length})`}>
            <Table
              dataSource={dependencies}
              rowKey={'package'}
              columns={columns}
              pagination={{ size: 'small' }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title={`DevDependencies (${devDependencies.length})`}>
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
