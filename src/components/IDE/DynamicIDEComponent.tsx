import dynamic from 'next/dynamic';

export const DynamicIDEComponent = dynamic(
  {
    loader: async () => {
      console.log('loading start IDE');
      const IDEModule = await import('./IDE');
      console.log('loading end IDE');
      return IDEModule.IDE;
    },
    ssr: false,
  },
  {
    loading: () => <div>loading...</div>,
    ssr: false,
  },
);
