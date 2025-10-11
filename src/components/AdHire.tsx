'use client';
import { Alert, Button } from 'antd';

export default function AdHire() {
  return (
    <Alert
      banner
      closable
      message={
        <>
          <Button href="https://zhuanlan.zhihu.com/p/598748057" target="_blank" type="link">
            蚂蚁体验技术部-上海招人啦
          </Button>
          {/* <Button href="https://galacean.antgroup.com/effects/" target="_blank" type="link">
            Galacean Effects · 所见即所得的动效新方案。前往了解
          </Button> */}
        </>
      }
      showIcon={false}
      type="info"
      style={{ textAlign: 'center' }}
    />
  );
}
