import { useRecentDownloads, useTotalDownloads } from '@/hooks/useRecentDownloads';
import React from 'react';
import { Empty } from 'antd';
import { Line } from 'react-chartjs-2';
import "chart.js/auto";

type RecentDownloadsContentProps = {
  pkgName: string;
  version: string;
};

type TotalDownloadsProps = {
  pkgNameList: string[];
};

const COLOR_LIST = [
  'rgb(53, 162, 235, 0.7)',
  'rgb(255, 99, 132, 0.7)',
  'rgb(255, 205, 86, 0.7)',
  'rgb(75, 192, 192, 0.7)',
  'rgb(153, 102, 255, 0.7)',
];

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

export function TotalDownloads({ pkgNameList }: TotalDownloadsProps) {
  // 通过 swr 来进行缓存，由于 hook 限制，不能直接 map 循环
  // 另一种方式是在 useTotalDownloads 中自行维护 cache 逻辑
  // 由于希望添加 pkgName 时页面不额外刷新，先采用这种方式
  const [pkg1, pkg2, pkg3, pkg4, pkg5] = pkgNameList;
  const {data: pkg1Data} = useTotalDownloads(pkg1);
  const {data: pkg2Data} = useTotalDownloads(pkg2);
  const {data: pkg3Data} = useTotalDownloads(pkg3);
  const {data: pkg4Data} = useTotalDownloads(pkg4);
  const {data: pkg5Data} = useTotalDownloads(pkg5);

  const res = [pkg1Data, pkg2Data, pkg3Data, pkg4Data, pkg5Data];

  if (!res.find(_ => _?.downloads)) {
    return <Empty description="暂无数据" />;
  }

  return (
    <Line
      options={{
        scales: {
          x: {
            display: true,
          },
        },
        elements: {
          line: {
            tension: 0.4,
          },
          point: {
            radius: 0,
          },
        },
        plugins: {
          tooltip: {
            enabled: true,
            mode: 'nearest',
            intersect: false,
            axis: 'x',
            callbacks: {
              // 自定义tooltip的标题
              title: function(contexts) {
                // 假设所有数据点共享相同的x轴标签
                let title = contexts[0].label;
                return title || '';
              },
              // 自定义tooltip的内容
              label: function(context) {
                // 这里可以访问到所有的数据点
                let label = context.dataset.label || '';

                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += context.parsed.y;
                }
                return label;
              },
            },
          },
        },
      }}
      data={{
        labels: res.find(_ => _?.downloads)!.downloads?.map((_) => _.day),
        datasets: res.filter(_ => _?.downloads).map((_, index) => {
          return {
            fill: false,
            label: pkgNameList[res.indexOf(_)],
            data: _!.downloads.map((_) => _.downloads),
            borderColor: COLOR_LIST[index],
            // 会影响到 label 展示，虽然 fill false 也一并添加
            backgroundColor: COLOR_LIST[index],
          }
        })
      }}
    />
  );
}
