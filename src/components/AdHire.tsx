'use client';
import { Alert, Button } from 'antd';
import Link from 'next/link';

export default function AdHire() {
  return (
    <Alert
      banner
      closable
      message={
        <Button href="https://zhuanlan.zhihu.com/p/598748057" target="_blank" type="link">
          蚂蚁体验技术部-上海招人啦
        </Button>
      }
      showIcon={false}
      type="info"
      style={{ textAlign: 'center' }}
    />
  );
}
