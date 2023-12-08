import dynamic from 'next/dynamic';

export const DynamicIDEComponent = dynamic(
  {
    loader: async () => import('./IDE').then((mod) => mod.IDE),
  },
  {
    ssr: false,
  },
);
