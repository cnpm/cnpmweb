import dynamic from 'next/dynamic';

export const DynamicIDEComponent = dynamic(
  {
    loader: async () => {
      console.log('loading start IDE');
      const IDEModule = await import('./IDE2');
      console.log('loading end IDE');
      return IDEModule.IDE2;
    },
    ssr: false,
  },
  {
    loading: () => <div>loading...</div>,
    ssr: false,
  },
);
