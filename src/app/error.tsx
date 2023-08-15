'use client';

import { Button, Result } from 'antd'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Result
      status='500'
      title={error.message}
      subTitle={'服务异常，请稍后再试'}
      extra={
        <Button type='primary' onClick={reset}>
          重试
        </Button>
      }
    />
  );

}
