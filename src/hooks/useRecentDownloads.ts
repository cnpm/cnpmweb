import { REGISTRY } from '@/config';
import dayjs from 'dayjs';
import useSwr from 'swr';

const DEFAULT_RANGE = 7;
const INIT_YEAR = 2020;

type DownloadRes = {
  downloads: { day: string; downloads: number; }[];
  versions?: {
    [version: string]: { day: string; downloads: number; }[];
  };
};

// https://registry.npmmirror.com/downloads/range/2023-01:2023-01/antd
// npmmirror 只支持按月维度返回
function getUrl(pkgName: string, range: number) {
  const today = dayjs();
  const todayStr = today.format('YYYY-MM-DD');
  const lastWeekStr = today.subtract(range, 'day').format('YYYY-MM-DD');
  return `${REGISTRY}/downloads/range/${lastWeekStr}:${todayStr}/${pkgName}`;
};

function getTotalUrl(pkgName: string) {
  const today = dayjs();
  const todayStr = today.format('YYYY-MM-DD');
  const years = today.year() - INIT_YEAR + 1;
  return new Array(years).fill(0).map((_, index) => {
    const year = INIT_YEAR + index;
    if (year === today.year()) {
      return `${REGISTRY}/downloads/range/${year}-01-01:${todayStr}/${pkgName}`;
    }
    return `${REGISTRY}/downloads/range/${INIT_YEAR + index}-01-01:${INIT_YEAR + index}-12-31/${pkgName}`;
  });
};

function normalizeRes(res: DownloadRes, version: string, range: number): DownloadRes {
  // 根据 range，获取最近 range 天的数据
  const downloads = res.downloads.slice(-range);
  // 单个版本可能没有数据，需要做 leftPad
  const versions = (new Array(range)).fill(0).map((_, index) => {
    const day = dayjs().subtract(range - index - 1, 'day').format('YYYY-MM-DD');
    const download = res.versions?.[version]?.find((item) => item.day === day);
    return download || {
      day,
      downloads: 0
    };
  });

  return {
    downloads,
    versions: {
      [version]: versions,
    }
  };
}
export const useRecentDownloads = (pkgName: string, version: string, range: number = DEFAULT_RANGE) => {
  return useSwr<DownloadRes>(`recent_downloads: ${pkgName}_${version}`, async () => {
    return fetch(`${getUrl(pkgName, range)}`)
      .then((res) => res.json())
      .then(res => normalizeRes(res, version, range));
  });
};

export const useTotalDownloads = (pkgName: string) => {
  return useSwr<DownloadRes>(pkgName ? `total_downloads: ${pkgName}` : null, async () => {
    const res = await Promise.all(getTotalUrl(pkgName).map((url) => fetch(url).then((res) => res.json())));
    return { downloads: res.reduce((acc, cur) => acc.concat(cur.downloads), []), versions: {} };
  }, {
    refreshInterval: 0,
  });
};
