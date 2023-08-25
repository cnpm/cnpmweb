'use client';
import { Button,message,Modal } from 'antd';
import Link from 'next/link';
import React from 'react';

interface SyncProps {
  pkgName: string;
}

export default function Sync({ pkgName }: SyncProps) {
  const [logId, setLogId] = React.useState<string>();
  const [modal, contextHolder] = Modal.useModal();

  async function showLog(id: string) {
    modal.success({
      title: '等待调度',
      content: (
        <>
          创建同步任务成功，正在等待调度，如遇日志 404 请稍后刷新重试，通常需要几十秒钟的时间
          <Link
            target='_blank'
            href={`https://registry.npmmirror.com/-/package/${pkgName}/syncs/${id}/log`}
          >
            查看日志
          </Link>
        </>
      ),
    });
  }

  async function doSync() {
    try {
      const res = await fetch(`https://registry-direct.npmmirror.com/-/package/${pkgName}/syncs`, {
        method: 'PUT',
      }).then((res) => res.json());
      if (res.ok) {
        setLogId(res.id);
      }
      showLog(res.id);
    } catch (e) {
      message.error('创建同步任务失败');
    }
  }

  return (
    <>
      {contextHolder}
      <Button
        size={'small'}
        type='primary'
        onClick={logId ? () => showLog(logId) : doSync}
      >
        {logId ? '查看日志' : '进行同步'}
      </Button>
    </>
  );
}
