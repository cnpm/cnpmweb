'use client';
import SizeContainer from './SizeContainer';
import Link from 'next/link';

export default function AdVPS() {
  return (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <Link href="https://render.alipay.com/p/s/taobaonpm_click/npmtaobao_click" target="_blank">
        <img
          style={{ borderRadius: 8 }}
          width={378}
          src="https://render.alipay.com/p/s/taobaonpm_click/npmtaobao_banner"
          alt="vps-ad"
        />
      </Link>
    </div>
  );
}
