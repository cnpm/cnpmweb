import {
  Space, Typography,
} from 'antd';
import Link from 'next/link';
import * as gitUrl from 'giturl';

import React from 'react';

type LinkContentProps = {
  git?: string;
  dist?: {
    tarball: string;
    size: string;
  };
};

function formatFileSize(bytes: number) {
  if (bytes === 0) return '0';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function LinkContent({
  git, dist
}: LinkContentProps) {
  const url = gitUrl.parse(git);
  const tarball = dist?.tarball;
  return (
    <Space direction='vertical' style={{whiteSpace: 'nowrap'}}>
      {url && (
        <Link href={gitUrl.parse(url)} target='_blank'>
          <Space size='small'>
            <span>源码:</span>
            <Typography.Text
              ellipsis
              style={{ color: 'inherit', maxWidth: 290 }}
            >
              {gitUrl.parse(url)}
            </Typography.Text>
          </Space>
        </Link>
      )}
      {tarball && (
        <Link href={tarball} target='_blank'>
          <Space size='small'>
            <span>产物:</span>
            <Typography.Text
              ellipsis
              style={{ color: 'inherit', maxWidth: 290 }}
            >
              {tarball.split('/').pop()}
              <span style={{ marginLeft: 4 }}>
                ({formatFileSize(Number(dist?.size))})
              </span>
            </Typography.Text>
          </Space>
        </Link>
      )}
    </Space>
  );
}
