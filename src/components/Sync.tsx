'use client';
import { REGISTRY, SYNC_REGISTRY } from '@/config';
import { Button, message, Modal } from 'antd';
import Link from 'next/link';
import React from 'react';

interface SyncProps {
  pkgName: string;
}

const LogStatus = {
  WAIT: 1,
  ERROR: 2,
  SUCCESS: 3,
}

export default function Sync({ pkgName }: SyncProps) {
  const [logId, setLogId] = React.useState<string>();
  const [logState, setLogState] = React.useState<number>(LogStatus.WAIT);
  const retryCountRef = React.useRef(0);
  const [modal, contextHolder] = Modal.useModal();

  function genLogFileUrl(id: string) {
    return `${REGISTRY}/-/package/${pkgName}/syncs/${id}/log`;
  }

  async function showLog(id: string) {
    modal.success({
      title: '等待调度',
      content: (
        <>
          创建同步任务成功，正在等待调度，如遇日志 404 请稍后刷新重试，通常需要几十秒钟的时间
          <Link target="_blank" href={genLogFileUrl(id)}>
            查看日志
          </Link>
        </>
      ),
    });
  }

  async function logPolling(id:string) {
    if (!id) {
      return;
    }
    retryCountRef.current += 1;
    try {
      const response = await fetch(genLogFileUrl(id));
      if (response.status === 200) {
        setLogState(LogStatus.SUCCESS);
        return;
      }
      throw new Error('Not ready');
    } catch {
      if (retryCountRef.current > 30) {
        setLogState(LogStatus.ERROR);
        return;
      }
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
        logPolling(res.id);
        return;
      }
      throw new Error('Not ok');
    } catch (e) {
      message.error('创建同步任务失败');
    }
  }

  return (
    <>
      {contextHolder}
      <Button size={'small'} type="primary" loading={ !!logId && logState === 1 } onClick={() => {
        if (!logId) {
          doSync();
          return;
        }
        if (logState === 2) {
          showLog(logId);
        }
      }}>
        {(() => {
            if (logId) {
              switch (logState) {
                case LogStatus.SUCCESS:
                  return <>查看日志</>;
                case LogStatus.ERROR:
                  return <>调度失败</>;
                default:
                  return <>等待调度</>;
              }
            }
            return <>进行同步</>;
        })()}
      </Button>
    </>
  );
}