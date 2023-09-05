import React from 'react';
import { Space, Typography, Tooltip } from 'antd';
import Link from 'next/link';
import * as gitUrl from 'giturl';
import { FileZipFilled, HomeFilled } from '@ant-design/icons';

const IconGit = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" d="M15.698 7.287L8.712.302a1.03 1.03 0 0 0-1.457 0l-1.45 1.45l1.84 1.84a1.223 1.223 0 0 1 1.55 1.56l1.773 1.774a1.224 1.224 0 0 1 1.267 2.025a1.226 1.226 0 0 1-2.002-1.334L8.58 5.963v4.353a1.226 1.226 0 1 1-1.008-.036V5.887a1.226 1.226 0 0 1-.666-1.608L5.093 2.465l-4.79 4.79a1.031 1.031 0 0 0 0 1.457l6.986 6.986a1.03 1.03 0 0 0 1.457 0l6.953-6.953a1.03 1.03 0 0 0 0-1.458"></path></svg>
)

type LinkContentProps = {
  git?: string;
  dist?: {
    tarball: string;
    size: string;
  };
  homepage?: string;
};

function formatFileSize(bytes: number) {
  if (bytes === 0) return '0';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function LinkContent({
  git, dist, homepage,
}: LinkContentProps) {
  const url = gitUrl.parse(git);
  const tarball = dist?.tarball;
  return (
    <Space direction='vertical' style={{ whiteSpace: 'nowrap' }} >
      {homepage && (
        <Tooltip title="首页">
          <Link href={homepage} target='_blank'>
            <Space size='small'>
              <HomeFilled />
              <Typography.Link ellipsis style={{ maxWidth: 358 }}>
                {homepage}
              </Typography.Link>
            </Space>
          </Link>
        </Tooltip>
      )}
      {url && (
        <Tooltip title="源码">
          <Link href={url} target='_blank'>
            <Space>
              <IconGit />
              <Typography.Link ellipsis style={{ maxWidth: 358 }}>
                {url}
              </Typography.Link>
            </Space>
          </Link>
        </Tooltip>
      )}
      {tarball && (
        <Tooltip title="资源">
          <Link href={tarball} target='_blank'>
            <Space>
              <FileZipFilled />
              <Typography.Link ellipsis style={{ maxWidth: 358 }}>
                {tarball.split('/').pop()}
                ({formatFileSize(Number(dist?.size))})
              </Typography.Link>
            </Space>
          </Link>
        </Tooltip>
      )}
    </Space>
  );
}
