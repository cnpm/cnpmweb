import { REGISTRY } from '@/config';
import useSwr from 'swr';

export default function useSyncLog(pkgName: string, logId?: string) {
  return useSwr(logId ? `sync_log_${logId}` : null, async () => {
    try {
      const res = await fetch(`${REGISTRY}/-/package/${pkgName}/syncs/${logId}/log`).then((res) => res.text());
      return res.split('\n');
    } catch (e) {
      return null;
    }
  }, {
    refreshInterval() {
      return 1000;
    },
  });
}
