import { REGISTRY } from '@/config';
import useSwr from 'swr';

export default function useRegistry() {
  return useSwr('registry', async () => {
    return fetch(`${REGISTRY}`).then((res) => res.json());
  });
}
