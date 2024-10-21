'use client';
import { REGISTRY, SYNC_REGISTRY } from '@/config';
import useSyncLog from '@/hooks/useSyncLog';
import { Button, message, Modal } from 'antd';
import ReactAnsi from 'react-ansi';
import React from 'react';

const MAX_RETRY = 30;

interface SyncProps {
  pkgName: string;
}

enum LogStatus {
  INIT,
  WAIT,
  ERROR,
  SUCCESS,
}

const LogStatusTextMap= {
  [LogStatus.INIT]: '进行同步',
  [LogStatus.WAIT]: '等待调度',
  [LogStatus.ERROR]: '调度失败',
  [LogStatus.SUCCESS]: '查看日志',
};

export default function Sync({ pkgName }: SyncProps) {
  const [logId, setLogId] = React.useState<string>();
  const [logState, setLogState] = React.useState<LogStatus>(LogStatus.INIT);
  const retryCountRef = React.useRef(0);
  const [showLog, setShowLog] = React.useState(false);
  const { data: logContent } = useSyncLog(pkgName, logId);

  function genLogFileUrl(id: string) {
    return `${REGISTRY}/-/package/${pkgName}/syncs/${id}/log`;
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
      if (retryCountRef.current > MAX_RETRY) {
        setLogState(LogStatus.ERROR);
        return;
      } else {
        if (LogStatus.WAIT !== logState) {
          setLogState(LogStatus.WAIT);
        }
        setTimeout(() => {
          logPolling(id);
        }, 1000);
      }
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
        setLogState(LogStatus.WAIT);
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
      <Button
        size={'small'}
        type="primary"
        loading={logState === LogStatus.WAIT}
        onClick={() => {
          if (logState === LogStatus.SUCCESS) {
            setShowLog(true);
            return;
          }
          if (!logId) {
            doSync();
            return;
          }
        }}
      >
        {LogStatusTextMap[logState]}
      </Button>

      <Modal
        centered
        open={showLog}
        width={'70%'}
        title="同步日志"
        footer={null}
        onCancel={() => setShowLog(false)}
      >
        <ReactAnsi
          key={logId}
          log={logContent || ['loading....']}
          bodyStyle={{ overflowY: 'auto', background: '#222', height: '600px' }}
          showHeader={false}
          autoScroll
        ></ReactAnsi>
      </Modal>
    </>
  );
}
