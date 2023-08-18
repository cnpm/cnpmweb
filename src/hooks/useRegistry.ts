import useSwr from 'swr';

const REGISTRY = 'https://registry.npmmirror.com';


export default function useRegistry() {
  return useSwr('registry', async () => {
    return fetch(`${REGISTRY}`)
      .then((res) => res.json());
  });
}
