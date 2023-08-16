'use client';
import { Col, Row, Space, Typography } from 'antd';
import style from './home.module.css';
import SizeContainer from '@/components/SizeContainer';
import PresetCard from '@/components/PresetCard';
import ReadmeContent from '@/components/ReadmeContent';
import { ContributorContent } from '@/components/ContributorContent';
import { LinkContent } from '@/components/LinkContnet';
import AdBanner from '@/components/AdBanner';
import AdVPS from '@/components/AdVPS';
import { PageProps } from '@/pages/package/[...slug]';

export default function Home({ manifest, version }: PageProps) {
  const pkg = manifest;
  const tags: string[] = pkg?.keywords || [];

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
          <AdVPS />
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
        <div className={style.sloganCon}>
          <Typography.Title>{pkg!.name}</Typography.Title>
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
