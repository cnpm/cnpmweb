'use client';
import { Gravatar } from '@/components/Gravatar';
import SizeContainer from '@/components/SizeContainer';
import {
  NpmPackageVersion,
  PackageManifest,
  useVersions,
  useVersionTags,
} from '@/hooks/useManifest';

import { Card, Pagination, Result, Segmented, Space, Tooltip, Typography } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import semver from 'semver';
import Link from 'next/link';
import SyncAlert from '@/components/SyncAlert';
import { PageProps } from '@/pages/package/[...slug]';
import { createStyles } from 'antd-style';
import VersionTags from '@/components/VersionTags';
import useQueryState from '@/hooks/useQueryState';

const useStyles = createStyles(({ token, css }) => {
  return {
    versionsCon: css`
      font-size: 16px;
      color: ${token.colorTextBase};
      padding: 0 16px;
      margin-top: 16px;
    `,
    versionsItem: css`
      display: flex;
      justify-content: space-between;
      align-items: stretch;
      margin: 16px;
    `,
    dot: css`
      display: block;
      flex-grow: 1;
      transform: translate(0, -11px);
      margin: 0 8px;
      border-bottom: 1px dotted ${token.colorBorder};
    `,
    border: css`
      border-bottom: 1px dotted ${token.colorBorder};
    `,
  };
});

function TagsList({ tagsInfo, pkg }: { tagsInfo: Record<string, string[]>; pkg: PackageManifest }) {
  const { styles } = useStyles();
  const [type, setTags] = useQueryState('tags', 'prod');
  const onlyProd = type === 'prod';

  // Memoize filtered tags
  const filteredTags = React.useMemo(() => {
    return Object.keys(tagsInfo || {}).filter(
      (item) => !onlyProd || !semver.parse(item)?.prerelease.length
    );
  }, [tagsInfo, onlyProd]);

  return (
    <div style={{ position: 'relative' }}>
      <Typography.Title
        level={4}
        className={styles.border}
        style={{
          fontSize: 16,
          paddingBottom: 16,
          position: 'relative',
        }}
      >
        当前 Tags
      </Typography.Title>
      <Space
        style={{
          position: 'absolute',
          right: 32,
          top: 0,
        }}
      >
        <Segmented
          value={type}
          options={[
            { label: '正式版本', value: 'prod' },
            { label: '所有版本', value: 'all' },
          ]}
          onChange={(v) => setTags(v as string)}
        />
      </Space>
      <ul className={styles.versionsCon}>
        <li className={styles.versionsItem}>
          <span>版本</span>
          <span className={styles.dot}></span>
          <span>Tag</span>
        </li>
        {filteredTags.map((item) => (
          <li className={styles.versionsItem} key={item}>
            <span>
              <Link prefetch={false} href={`/package/${pkg!.name}/home?version=${item}`}>
                {item}
              </Link>
            </span>
            <span className={styles.dot}></span>
            <VersionTags tags={tagsInfo[item]} max={8}></VersionTags>
          </li>
        ))}
      </ul>
    </div>
  );
}

const PAGE_SIZE = 50;

function VersionsList({ versions, pkg }: { versions: NpmPackageVersion[]; pkg: PackageManifest }) {
  const { styles } = useStyles();
  const [type, setVersions] = useQueryState('versions', 'prod');
  const [page, setPage] = React.useState(1);
  const onlyProd = type === 'prod';

  // Memoize filtered and sorted versions
  const filteredVersions = React.useMemo(() => {
    return versions
      .filter((item) => !onlyProd || !semver.parse(item.version)?.prerelease.length)
      .sort((a, b) => (dayjs(a.publish_time).isAfter(b.publish_time) ? -1 : 1));
  }, [versions, onlyProd]);

  // Reset page when filter changes
  React.useEffect(() => {
    setPage(1);
  }, [onlyProd]);

  // Get current page items
  const pageItems = React.useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredVersions.slice(start, start + PAGE_SIZE);
  }, [filteredVersions, page]);

  return (
    <div style={{ position: 'relative' }}>
      <Typography.Title
        level={4}
        className={styles.border}
        style={{
          fontSize: 18,
          paddingBottom: 16,
          position: 'relative',
        }}
      >
        版本记录
      </Typography.Title>
      <Space
        style={{
          position: 'absolute',
          right: 32,
          top: 0,
        }}
      >
        <Segmented
          value={type}
          options={[
            { label: '正式版本', value: 'prod' },
            { label: '所有版本', value: 'all' },
          ]}
          onChange={(v) => setVersions(v as string)}
        />
      </Space>
      <ul className={styles.versionsCon}>
        <li className={styles.versionsItem}>
          <span>版本</span>
          <span className={styles.dot}></span>
          <span>发布信息</span>
        </li>
        {pageItems.map((item) => (
          <li className={styles.versionsItem} key={item.version}>
            <Typography.Text delete={!!item.deprecated}>
              <Link
                prefetch={false}
                title={item.deprecated}
                shallow
                href={`/package/${pkg!.name}?version=${item.version}`}
              >
                {item.version}
              </Link>
            </Typography.Text>
            <span className={styles.dot}></span>
            <Typography.Text type="secondary">
              <Space size="small">
                {item._npmUser?.name ? (
                  <>
                    <span>由</span>
                    <Tooltip title={item._npmUser.name.replace('buc:', '')}>
                      <Gravatar email={item._npmUser.email} name={item._npmUser.name} />
                    </Tooltip>
                    <span>发布于</span>
                  </>
                ) : null}
                <Tooltip title={dayjs(item.publish_time).format('YYYY-MM-DD HH:mm:ss Z')}>
                  {dayjs(item.publish_time).format('YYYY-MM-DD')}
                </Tooltip>
              </Space>
            </Typography.Text>
          </li>
        ))}
      </ul>
      {filteredVersions.length > PAGE_SIZE && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
          <Pagination
            current={page}
            pageSize={PAGE_SIZE}
            total={filteredVersions.length}
            onChange={setPage}
            showSizeChanger={false}
            showTotal={(total) => `共 ${total} 个版本`}
          />
        </div>
      )}
    </div>
  );
}

export default function ReadOnlyVersions({ manifest: pkg }: PageProps) {
  const versions = useVersions(pkg);
  const tagsInfo = useVersionTags(pkg);
  const publishedVersions = versions;

  if (publishedVersions.length === 0) {
    return (
      <SizeContainer maxWidth={1072}>
        <Result title="暂未发布版本" />
      </SizeContainer>
    );
  }

  return (
    <>
      <SizeContainer maxWidth={1072}>
        <SyncAlert pkg={pkg} />
        <Card style={{ marginTop: 24 }}>
          <TagsList pkg={pkg} tagsInfo={tagsInfo}></TagsList>
          <VersionsList pkg={pkg} versions={versions}></VersionsList>
        </Card>
      </SizeContainer>
    </>
  );
}
