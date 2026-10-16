'use client';
import { Gravatar } from '@/components/Gravatar';
import SizeContainer from '@/components/SizeContainer';
import {
  NpmPackageVersion,
  PackageManifest,
  useVersions,
  useVersionTags,
} from '@/hooks/useManifest';

import {
  Card,
  Empty,
  Input,
  Pagination,
  Result,
  Segmented,
  Space,
  Tooltip,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import semver from 'semver';
import Link from 'next/link';
import SyncAlert from '@/components/SyncAlert';
import { PageProps } from '@/pages/package/[...slug]';
import { createStyles } from 'antd-style';
import VersionTags from '@/components/VersionTags';
import useQueryState from '@/hooks/useQueryState';
import { getDependencyMatches, parseDependencyFilter } from './dependencyFilter';

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
    dependencyDetails: css`
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
      overflow-wrap: anywhere;
      min-width: 0;
    `,
    versionRecord: css`
      flex-direction: column;
      gap: 4px;
    `,
    versionHeading: css`
      display: flex;
      justify-content: space-between;
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
      (item) => !onlyProd || !semver.parse(item)?.prerelease.length,
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
  const [dependency, setDependency] = useQueryState('dependency', '');
  const [page, setPage] = React.useState(1);
  const onlyProd = type === 'prod';
  const query = dependency.trim();
  const dependencyFilter = React.useMemo(() => parseDependencyFilter(query), [query]);
  const invalidDependency = !!query && !dependencyFilter;

  // Memoize filtered and sorted versions
  const filteredVersions = React.useMemo(() => {
    if (invalidDependency) return [];

    return versions
      .filter((item) => !onlyProd || !semver.parse(item.version)?.prerelease.length)
      .map((item) => ({
        item,
        matches: dependencyFilter ? getDependencyMatches(item, dependencyFilter) : [],
      }))
      .filter(({ matches }) => !dependencyFilter || matches.length > 0)
      .sort((a, b) => (dayjs(a.item.publish_time).isAfter(b.item.publish_time) ? -1 : 1));
  }, [versions, onlyProd, dependencyFilter, invalidDependency]);

  // Reset page when filter changes
  React.useEffect(() => {
    setPage(1);
  }, [onlyProd, query, pkg.name]);

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
      <Space direction="vertical" style={{ width: '100%' }}>
        <label htmlFor="dependency-filter">按依赖包筛选版本</label>
        <Input
          id="dependency-filter"
          value={dependency}
          onChange={(event) => setDependency(event.target.value)}
          allowClear
          placeholder="例如：webpack、webpack@3.0.0、webpack@^3.0.0、@babel/core@^7"
          status={invalidDependency ? 'error' : undefined}
          aria-invalid={invalidDependency}
          aria-describedby={
            invalidDependency ? 'dependency-filter-error' : 'dependency-filter-help'
          }
        />
        <Typography.Text type="secondary" id="dependency-filter-help">
          搜索运行、开发、可选和 peer
          依赖。仅输入包名可匹配任意版本；指定版本须满足依赖范围，指定范围须与依赖范围有交集。
        </Typography.Text>
        {invalidDependency ? (
          <Typography.Text type="danger" id="dependency-filter-error" role="alert">
            请输入有效的依赖包名，可附带版本号或版本范围，例如 webpack@^3.0.0。
          </Typography.Text>
        ) : query ? (
          <Typography.Text role="status">匹配 {filteredVersions.length} 个版本</Typography.Text>
        ) : null}
      </Space>
      <ul className={styles.versionsCon}>
        <li className={styles.versionsItem}>
          <span>版本</span>
          <span className={styles.dot}></span>
          <span>发布信息</span>
        </li>
        {pageItems.map(({ item, matches }) => (
          <li className={`${styles.versionsItem} ${styles.versionRecord}`} key={item.version}>
            <div className={styles.versionHeading}>
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
            </div>
            {dependencyFilter && matches.length > 0 && (
              <div className={styles.dependencyDetails}>
                {matches.map(({ type, spec }) => (
                  <Typography.Text type="secondary" key={type}>
                    {type}: {dependencyFilter.name}@{spec}
                  </Typography.Text>
                ))}
                <Link prefetch={false} href={`/package/${pkg.name}/deps?version=${item.version}`}>
                  查看完整依赖
                </Link>
              </div>
            )}
          </li>
        ))}
      </ul>
      {query && !invalidDependency && filteredVersions.length === 0 && (
        <Empty description="没有匹配的版本" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
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
