import { REGISTRY } from '@/config';
import dayjs from 'dayjs';
import useSwr from 'swr';

export default function useRegistry() {
  return useSwr('registry', async () => {
    try {
      const res = await fetch(`${REGISTRY}`).then((res) => res.json());
      return {
        docCount: res.doc_count.toLocaleString('en-US'),
        docVersionCount: res.doc_version_count.toLocaleString('en-US'),
        weekDownloads: res.download.thisweek.toLocaleString('en-US'),
        lastPackage: res.sync_changes_steam.last_package,
        lastPackageCreated: dayjs(res.sync_changes_steam.last_package_created).format('YYYY-MM-DD HH:mm:ss'),
      };
    } catch (e) {
      return {};
    }
  });
}
