import { REGISTRY } from '@/config';
import dayjs from 'dayjs';
import useSwr from 'swr';

type DownloadRes = {
  downloads: { day: string; downloads: number; }[];
  versions?: {
    [version: string]: { day: string; downloads: number; }[];
  };
};

// https://registry.npmmirror.com/downloads/range/2023-01-01:2023-12-28/antd
function getUrl(pkgName: string, range = 8) {
  const today = dayjs();
  const todayStr = today.format('YYYY-MM-DD');
  const lastWeekStr = today.subtract(range, 'day').format('YYYY-MM-DD');
  return `${REGISTRY}/downloads/range/${lastWeekStr}:${todayStr}/${pkgName}`;
};
export const useRecentDownloads = (pkgName: string, version: string, range?: number) => {
  return useSwr<DownloadRes>(`recent_downloads: ${pkgName}_${version}`, async () => {
    return fetch(`${getUrl(pkgName, range)}`)
      .then((res) => res.json());
  });
};
