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
  Result,
  Segmented,
  Space,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import semver from 'semver';
import styles from './versions.module.css';
import Link from 'next/link';
import { PageProps } from '../page';
import AntdStyle from '@/components/AntdStyle';

function TagsList({
  tagsInfo,
  pkg,
}: {
  tagsInfo: Record<string, string[]>;
  pkg: PackageManifest;
}) {
  const [onlyProd, setOnlyProd] = React.useState(true);
  return (
    <div style={{ position: 'relative' }}>
      <Typography.Title
        level={4}
        style={{
          fontSize: 16,
          paddingBottom: 16,
          borderBottom: '1px dotted #ccc',
          color: '#111',
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
          options={[
            { label: '正式版本', value: 'prod' },
            { label: '所有版本', value: 'all' },
          ]}
          onChange={(v) => setOnlyProd(v === 'prod')}
        />
      </Space>
      <ul className={styles.versionsCon}>
        <li className={styles.versionsItem}>
          <span>版本</span>
          <span className={styles.dot}></span>
          <span>Tag</span>
        </li>
        {Object.keys(tagsInfo).map((item) => {
          if (onlyProd && semver.parse(item)?.prerelease.length) {
            return null;
          }
          return (
            <li className={styles.versionsItem} key={item}>
              <span>
                <Link href={`/package/${pkg!.name}/home?version=${item}`}>
                  {item}
                </Link>
              </span>
              <span className={styles.dot}></span>
              <Space size='small'>
                {tagsInfo[item].map((tag) => {
                  if (tag === 'latest') {
                    return (
                      <Tooltip title='默认匹配的版本' key={tag}>
                        <Tag color={'green'}>{tag}</Tag>
                      </Tooltip>
                    );
                  }
                  if (/latest-\d/.test(tag)) {
                    const version = tag.split('-')[1];
                    return (
                      <Tooltip
                        key={tag}
                        title={`对于 ${version}.x.x 的版本，优先返回 ${item}`}
                      >
                        <Tag color={'green'}>{tag}</Tag>
                      </Tooltip>
                    );
                  }
                  return (
                    <Tag key={item} color='lime'>
                      {tag}
                    </Tag>
                  );
                })}
              </Space>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function VersionsList({
  versions,
  pkg
}: {
  versions: NpmPackageVersion[];
  pkg: PackageManifest;
}) {
  const [onlyProd, setOnlyProd] = React.useState(true);
  return (
    <div style={{ position: 'relative' }}>
      <Typography.Title
        level={4}
        style={{
          fontSize: 18,
          paddingBottom: 16,
          borderBottom: '1px dotted #ccc',
          color: '#111',
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
          options={[
            { label: '正式版本', value: 'prod' },
            { label: '所有版本', value: 'all' },
          ]}
          onChange={(v) => setOnlyProd(v === 'prod')}
        />
      </Space>
      <ul className={styles.versionsCon}>
        <li className={styles.versionsItem}>
          <span>版本</span>
          <span className={styles.dot}></span>
          <span>发布信息</span>
        </li>
        {versions.map((item) => {
          if (onlyProd && semver.parse(item.version)?.prerelease.length) {
            return null;
          }

          return (
            <li className={styles.versionsItem} key={item.version}>
              <span>
                <Link
                  style={
                    item.deprecated
                      ? {
                          color: 'rgba(0,0,0,.25)',
                          textDecoration: 'line-through',
                        }
                      : {}
                  }
                  href={`/package/${pkg!.name}?version=${item.version}`}
                >
                  {item.version}
                </Link>
              </span>
              <span className={styles.dot}></span>
              <Typography.Text type="secondary">
                <Space size="small">
                  {item._npmUser?.name ? (
                    <>
                      <span>由</span>
                      <Tooltip title={item._npmUser.name.replace('buc:', '')}>
                        <Link
                          href={`/users/${item._npmUser.name}`}
                          target="_blank"
                        >
                            <Gravatar
                              email={item._npmUser.email}
                              name={item._npmUser.name}
                            />
                        </Link>
                      </Tooltip>
                      <span>发布于</span>
                    </>
                  ) : null}
                  <Tooltip
                    title={dayjs(item.publish_time).format(
                      'YYYY-MM-DD HH:mm:SS',
                    )}
                  >
                    {dayjs(item.publish_time).format('YYYY-MM-DD')}
                  </Tooltip>
                </Space>
              </Typography.Text>
            </li>
          );
        })}
      </ul>
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
        <Result title='暂未发布版本' />
      </SizeContainer>
    );
  }

  return (
    <>
      <SizeContainer maxWidth={1072}>
        <AntdStyle>
          <Card style={{ marginTop: 24 }}>
            <TagsList pkg={pkg} tagsInfo={tagsInfo}></TagsList>
            <VersionsList pkg={pkg} versions={versions}></VersionsList>
          </Card>
        </AntdStyle>
      </SizeContainer>
    </>
  );
}
