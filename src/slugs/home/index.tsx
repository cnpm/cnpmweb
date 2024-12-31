'use client';
import { Alert, Col, Row, Space, Tooltip, Typography } from 'antd';
import SizeContainer from '@/components/SizeContainer';
import PresetCard from '@/components/PresetCard';
import ReadmeContent from '@/components/ReadmeContent';
import { ContributorContent } from '@/components/ContributorContent';
import { LinkContent } from '@/components/LinkContnet';
import AdBanner from '@/components/AdBanner';
import AdVPS from '@/components/AdVPS';
import { PageProps } from '@/pages/package/[...slug]';
import { createStyles } from 'antd-style';
import RecentVersion from '@/components/RecentVersion';
import Sync from '@/components/Sync';
import { PackageTag } from '@/components/PackageCard';
import { RecentDownloads } from '@/components/RecentDownloads';

const useStyles = createStyles(({ token, css }) => {
  return {
    homeCon: css`
      position: relative;
      padding-top: 48px;
      overflow: hidden;
    `,
    tagCon: css`
      margin-bottom: 16px;
    `,
    tagItem: css`
      margin-right: 8px;
      padding: 0 8px;
      font-size: 12px;
      line-height: 22px;
      white-space: nowrap;
      color: white;
      background: ${token.blue4};
      border-radius: 2px;
    `,
  };
});

export default function Home({ manifest, version, additionalInfo: needSync }: PageProps) {
  const pkg = manifest;
  const tags: string[] = pkg?.keywords || [];
  const deprecated = pkg?.versions?.[version!]?.deprecated;
  const { styles: style } = useStyles();

  const contentNode = (
    <Row gutter={[16, 16]} wrap={false} style={{ marginBottom: 96 }}>
      <Col flex="1 1 0">
        <div
          style={{
            marginBottom: 16,
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          <AdBanner />
        </div>
        <PresetCard title="项目文档" style={{ minHeight: '100%' }}>
          <ReadmeContent name={manifest.name} version={version} content={pkg.readme}/>
        </PresetCard>
      </Col>
      <Col flex="0 0 378px" style={{ minWidth: "auto" }}>
        <Space direction={'vertical'} size="middle" style={{ minWidth: 378 }}>
          <AdVPS />
          <PresetCard title="下载趋势">
            <RecentDownloads pkgName={manifest.name} version={version!} />
          </PresetCard>
          {manifest.maintainers?.length > 0 && (
            <PresetCard title="项目成员">
              <ContributorContent members={manifest.maintainers} />
            </PresetCard>
          )}
          <PresetCard title="相关链接">
            <LinkContent
              git={manifest.repository?.url}
              dist={manifest.versions?.[version!]?.dist}
              homepage={manifest.homepage}
            />
          </PresetCard>
          <PresetCard
            title="最近更新"
            // 目前暂不支持自动版本比对，需访问源站进行确认
            subTitle={<Sync pkgName={pkg.name} />}
          >
            <RecentVersion pkg={pkg} />
          </PresetCard>
        </Space>
      </Col>
    </Row>
  );

  return (
    <div className={style.homeCon}>
      <SizeContainer maxWidth={1280} style={{ position: 'relative', marginTop: 0 }}>
        <div>
          <Typography.Title>{pkg!.name}</Typography.Title>
          <Typography.Paragraph ellipsis>{pkg!.description}</Typography.Paragraph>
          <div className={style.tagCon}>
            <PackageTag tags={tags?.map((tag) => ({ label: tag, href: `/packages?q=${tag}` }))} />
          </div>
          {deprecated && <div style={{ marginBottom: 16 }}>
            <Alert message={`Deprecated: ${deprecated}`} type="warning" />
          </div>}
        </div>
        {contentNode}
      </SizeContainer>
    </div>
  );
}
