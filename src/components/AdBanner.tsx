'use client';
export default function AdBanner() {
  return (
    <div style={{ position: 'fixed', top: 0, zIndex: 100, left: 0 }}>
      <img
        src='https://render.alipay.com/p/s/taobaonpm_click/image_1'
        width={'100%'}
        alt='ad'
      />
    </div>
  );
}
