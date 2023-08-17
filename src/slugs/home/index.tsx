'use client';
import { Button, Col, Row, Space, Tooltip, Typography } from 'antd';
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
import { QuestionCircleFilled } from '@ant-design/icons';

const useStyles = createStyles(({ token, css }) => {
  return {
    homeCon: css`
      position: relative;
      padding-top: 48px;
      overflow: hidden;
    `,
    tagCon: css`
      display: inline-flex;
      flex-wrap: wrap;
      padding: 0;
      list-style: none;
      row-gap: 8px;
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
  const { styles: style } = useStyles();

  const contentNode = (
    <Row gutter={[16, 16]} style={{ marginBottom: 96 }}>
      <Col flex='1 1 0'>
        <div
          style={{
            marginBottom: 16,
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          <AdBanner />
        </div>
        <PresetCard title='项目文档' style={{ minHeight: '100%' }}>
          <ReadmeContent name={manifest.name} version={version} />
        </PresetCard>
      </Col>
      <Col flex='0 0 378px'>
        <Space direction={'vertical'} size='middle' style={{ minWidth: 378 }}>
          <AdVPS />
          {manifest.maintainers?.length > 0 && (
            <PresetCard title='项目成员'>
              <ContributorContent members={manifest.maintainers} />
            </PresetCard>
          )}
          <PresetCard title='相关链接'>
            <LinkContent
              git={manifest.repository?.url}
              dist={manifest.versions?.[version!]?.dist}
            />
          </PresetCard>
          <PresetCard
            title='最近更新'
            subTitle={
              needSync ? (
                <Sync pkgName={pkg.name} />
              ) : (
                <Tooltip title={'和源站数据比对一致'}>无需同步</Tooltip>
              )
            }
          >
            <RecentVersion pkg={pkg} />
          </PresetCard>
        </Space>
      </Col>
    </Row>
  );

  return (
    <div className={style.homeCon}>
      <SizeContainer
        maxWidth={1280}
        style={{ position: 'relative', marginTop: 0 }}
      >
        <div>
          <Typography.Title>
            {pkg!.name}
          </Typography.Title>
          <Typography.Paragraph ellipsis>
            {pkg!.description}
          </Typography.Paragraph>
          <div>
            <ul className={style.tagCon}>
              {tags?.map((tag) => {
                return (
                  <li key={tag} className={style.tagItem}>
                    {tag}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        {contentNode}
      </SizeContainer>
    </div>
  );
}
