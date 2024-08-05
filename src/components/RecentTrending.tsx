'use client';
import { Badge, Card, Flex, Statistic, Typography } from 'antd';
import AdVPS from './AdVPS';
import useRegistry from '@/hooks/useRegistry';

const {Text, Paragraph, Link} = Typography;

export default function RecentTrending() {
  const { data } = useRegistry();
  return (
    <Flex gap={24} style={{ flexDirection: 'column' }}>
      <Card title="同步状态">
        <Paragraph style={{ padding: 0, margin: 0, marginLeft: -24 }}>
          <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            <li>
              累计同步包数量：<Text strong>{data?.docCount}</Text>
            </li>
            <li>
              累计同步版本数量：<Text strong>{data?.docVersionCount}</Text>
            </li>
            <li>
              近7日下载量：<Text strong>{data?.weekDownloads}</Text>
            </li>
            <li>
              最近同步时间：<Text strong>{data?.lastPackageCreated}</Text>
            </li>
            <li>
              最近同步的包：
              <Link href={`/${data?.lastPackage}`} target="_blank" style={{ maxWidth: '220px'}} ellipsis>
                {data?.lastPackage}
              </Link>
            </li>
          </ol>
        </Paragraph>
      </Card>
      <AdVPS />
    </Flex>
  );
}
