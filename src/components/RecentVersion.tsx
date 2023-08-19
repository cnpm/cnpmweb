'use client';
import { Button, Space, Tag, Tooltip, Typography } from 'antd';
import React from 'react';
import { createStyles } from 'antd-style';
import {
  PackageManifest,
  useVersionTags,
  useVersions,
} from '@/hooks/useManifest';
import dayjs from 'dayjs';
import Link from 'next/link';
import VersionTags from './VersionTags';

const useStyles = createStyles(({ token, css }) => {
  return {
    container: css`
      position: relative;
      padding: 20px 24px;
      overflow: hidden;
      border: 1px solid ${token.colorBorder};
      border-radius: 8px;
      box-shadow: ${token.boxShadowTertiary};
      background: ${token.colorBgContainer};
    `,
    title: css`
      display: flex;
      align-items: center;
    `,
    viewAll: css`
      padding-top: 16px;
      text-align: center;
      width: 100%;
      display: block;
    `,
    date: css`
      color: ${token.colorTextSecondary};
      font-weight: normal;
      font-size: 14px;
      letter-spacing: 0;
      opacity: 0.65;
    `,
    content: css`
      flex: 1;
      color: ${token.colorTextBase};
      font-size: 16px;
      line-height: 22px;
      letter-spacing: 0;
    `,
    newTag: css`
      margin-left: 8px;
      color: ${token.colorError};
      font-weight: normal;
      font-size: 14px;
    `,
    version: css`
      padding-bottom: 4px;
      padding-top: 16px;
      border-bottom: 1px solid ${token.colorBorder};
    `,
  };
});

export interface PresetCardProps {
  pkg: PackageManifest;
}

export default function RecentVersion({ pkg }: PresetCardProps) {
  const versions = useVersions(pkg);
  const tags = useVersionTags(pkg);
  const { styles } = useStyles();

  return (
    <div style={{ overflow: 'hidden', minHeight: 90 }}>
      {versions.slice(0, 4).map((item, index) => {
        const publishDate = dayjs(item.publish_time);
        const isNew = publishDate.isAfter(dayjs().add(-14, 'day'));
        const deprecated = item.deprecated;

        return (
          <div className={styles.version} key={index}>
            <Link href={`/package/${pkg?.name}?version=${item.version}`}>
              <Typography.Title level={3} className={styles.title}>
                <span
                  className={styles.content}
                  style={
                    deprecated
                      ? {
                          color: 'rgba(0,0,0,.25)',
                          textDecoration: 'line-through',
                        }
                      : {}
                  }
                >
                  <Space size='small' style={{ flex: 1 }}>
                    {item.version}
                    <VersionTags
                      tags={tags[item.version]}
                      style={{
                        marginLeft: 8,
                      }}
                      max={1}
                    />
                  </Space>
                  {isNew && !deprecated ? (
                    <span className={styles.newTag}>New</span>
                  ) : null}
                </span>
                <Tooltip title={publishDate.format('YYYY-MM-DD HH:mm:ss Z')}>
                  <span className={styles.date}>
                    {publishDate.format('YYYY-MM-DD')}
                  </span>
                </Tooltip>
              </Typography.Title>
            </Link>
          </div>
        );
      })}

      {/* 查看全部 */}
      <Link className={styles.viewAll} href={`/package/${pkg!.name}/versions`}>
        <Button>查看全部</Button>
      </Link>
    </div>
  );
}
