import dynamic from 'next/dynamic';

export const DynamicIDEComponent = dynamic(
  {
    loader: async () => {
      console.log('loading IDE');
      const IDEModule = await import('./IDE');
      return IDEModule.IDE;
    },
    ssr: false,
  },
  {
    loading: () => <div>loading...</div>,
    ssr: false,
  },
);
