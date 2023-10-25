'use client';

import { Result } from 'antd';
import { useEffect } from 'react';

export default function Error({ error }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Result status="500" title={error?.message || '系统错误'} subTitle={'服务异常，请稍后再试'} />
  );
}
