'use client';
import { REGISTRY, SYNC_REGISTRY } from '@/config';
import { Button, message, Modal } from 'antd';
import Link from 'next/link';
import React, { useMemo } from 'react';

interface SyncProps {
  pkgName: string;
}

export default function Sync({ pkgName }: SyncProps) {
  const [logId, setLogId] = React.useState<string>();
  const [logState, setLogState] = React.useState<number>(0);
  const [modal, contextHolder] = Modal.useModal();

  const logFileUrl = useMemo(() => {
    return `${REGISTRY}/-/package/${pkgName}/syncs/${logId}/log`;
  }, [logId])

  async function showLog() {
    modal.success({
      title: '等待调度',
      content: (
        <>
          创建同步任务成功，正在等待调度，如遇日志 404 请稍后刷新重试，通常需要几十秒钟的时间
          <Link target="_blank" href={logFileUrl}>
            查看日志
          </Link>
        </>
      ),
    });
  }

  async function logPolling() {
    try {
      const response = await fetch(logFileUrl);
      if (response.status === 200) {
        setLogState(2);
        return;
      }
      throw new Error('Not ready');
    } catch {
      setTimeout(logPolling, 1000);
    }
  }

  async function doSync() {
    try {
      const response = await fetch(`${SYNC_REGISTRY}/-/package/${pkgName}/syncs`, {
        method: 'PUT',
      })
      const res = await response.json();
      if (res.ok) {
        setLogId(res.id);
        setLogState(1);
        logPolling();
      }
      throw new Error('Not ok');
    } catch (e) {
      message.error('创建同步任务失败');
    }
  }

  return (
    <>
      {contextHolder}
      <Button size={'small'} type="primary" onClick={() => {
        if (!logId) {
          doSync();
          return;
        }
        if (logState === 2) {
          showLog();
        }
      }}>
        {logState === 0 ? '进行同步' : logState === 2 ? '查看日志' : '等待调度'}
      </Button>
    </>
  );
}
