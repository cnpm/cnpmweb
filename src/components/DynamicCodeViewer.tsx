import dynamic from 'next/dynamic';

export const DynamicCodeViewer = dynamic(
  () => import('./CodeViewer'),
  { ssr: false } // 这将组件设置为只在客户端渲染
);
