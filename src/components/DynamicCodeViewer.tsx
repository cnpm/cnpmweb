import dynamic from 'next/dynamic';

export const DynamicCodeViewer = dynamic(
  () => import('./CodeViewer'),
  { ssr: false, loading: () => <p>Loading ...</p> } // 这将组件设置为只在客户端渲染
);
