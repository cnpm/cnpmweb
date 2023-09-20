'use client';
import { Gravatar } from '@/components/Gravatar';
import SizeContainer from '@/components/SizeContainer';
import {
  NpmPackageVersion,
  PackageManifest,
  useVersions,
  useVersionTags,
} from '@/hooks/useManifest';

import { Card, Result, Segmented, Space, Tag, Tooltip, Typography } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import semver from 'semver';
import Link from 'next/link';
import SyncAlert from '@/components/SyncAlert';
import { PageProps } from '@/pages/package/[...slug]';
import { createStyles } from 'antd-style';
import VersionTags from '@/components/VersionTags';

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
    `
  };
});

function TagsList({
  tagsInfo,
  pkg,
}: {
  tagsInfo: Record<string, string[]>;
  pkg: PackageManifest;
}) {
  const { styles } = useStyles();
  const [onlyProd, setOnlyProd] = React.useState(true);
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
        {Object.keys(tagsInfo || {}).map((item) => {
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
              <VersionTags tags={tagsInfo[item]} max={8}></VersionTags>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function VersionsList({
  versions,
  pkg,
}: {
  versions: NpmPackageVersion[];
  pkg: PackageManifest;
}) {
  const { styles } = useStyles();
  const [onlyProd, setOnlyProd] = React.useState(true);
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
        {versions
          .sort((a, b) =>
            dayjs(a.publish_time).isAfter(b.publish_time) ? -1 : 1
          )
          ?.map((item) => {
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
                    shallow
                    href={`/package/${pkg!.name}?version=${item.version}`}
                  >
                    {item.version}
                  </Link>
                </span>
                <span className={styles.dot}></span>
                <Typography.Text type='secondary'>
                  <Space size='small'>
                    {item._npmUser?.name ? (
                      <>
                        <span>由</span>
                        <Tooltip title={item._npmUser.name.replace('buc:', '')}>
                          <Gravatar
                            email={item._npmUser.email}
                            name={item._npmUser.name}
                          />
                        </Tooltip>
                        <span>发布于</span>
                      </>
                    ) : null}
                    <Tooltip
                      title={dayjs(item.publish_time).format(
                        'YYYY-MM-DD HH:mm:ss Z'
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

export default function ReadOnlyVersions({
  manifest: pkg,
  additionalInfo: needSync,
}: PageProps) {
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
        <SyncAlert pkg={pkg} needSync={needSync} />
        <Card style={{ marginTop: 24 }}>
          <TagsList pkg={pkg} tagsInfo={tagsInfo}></TagsList>
          <VersionsList pkg={pkg} versions={versions}></VersionsList>
        </Card>
      </SizeContainer>
    </>
  );
}
