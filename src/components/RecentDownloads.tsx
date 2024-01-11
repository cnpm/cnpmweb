import { useRecentDownloads } from '@/hooks/useRecentDownloads';
import React from 'react';
import { Empty } from 'antd';

import { Line } from 'react-chartjs-2';
import "chart.js/auto";
import { scales } from 'chart.js/auto';


type RecentDownloadsContentProps = {
  pkgName: string;
  version: string;
};

export function RecentDownloads({ pkgName, version }: RecentDownloadsContentProps) {
  const { data: res, isLoading } = useRecentDownloads(pkgName, version);
  if (isLoading || !res) {
    return <Empty description="暂无数据" />;
  }

  return (
    <Line
      options={{
        scales: {
          x: {
            display: false,
          },
        },
        plugins: {
          tooltip: {
            enabled: true,
          },
        },
      }}
      data={{
        labels: res!.versions?.[version]?.map((_) => _.day),
        datasets: [
          {
            fill: true,
            label: '所有版本',
            data: res!.downloads?.map((_) => _.downloads),
            borderColor: 'rgb(53, 162, 235, 0.7)',
            backgroundColor: 'rgba(53, 162, 235, 0.4)',
          },
          {
            fill: true,
            label: version,
            data: res!.versions?.[version]?.map((_) => _.downloads),
            borderColor: 'rgb(53, 162, 235, 0.8)',
            backgroundColor: 'rgba(53, 162, 235, 0.7)',
          },
        ],
      }}
    />
  );
}
