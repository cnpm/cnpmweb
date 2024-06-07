import { REGISTRY } from '@/config';
import useSwr from 'swr';

export interface Directory {
  path: string;
  type: string;
  files: (File | Directory)[];
}

export interface File {
  path: string;
  type: 'file' | 'directory';
  contentType?: string;
  integrity?: string;
  lastModified?: string;
  size?: number;
  files?: File[];
}

type PkgInfo = {
  fullname: string;
  spec?: string;
};

function sortFiles(files: (File | Directory)[]) {
  files.sort((a, b) => {
    if (a.type === 'directory' && b.type !== 'directory') {
      return -1;
    }
    if (a.type !== 'directory' && b.type === 'directory') {
      return 1;
    }
    return a.path > b.path ? 1 : -1;
  });

  files.forEach((item) => {
    if (item.files) {
      sortFiles(item.files);
    }
  });
}

export const useDirs = (info: PkgInfo, path = '', ignore = false) => {
  // https://github.com/cnpm/cnpmcore/issues/680
  // 请求文件路径存在性能问题，手动关闭 revalidate ，拆分多次请求
  return useSwr(ignore ? null : `dirs: ${info.fullname}_${info.spec}_${path}`, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    // 本地缓存优先
    refreshInterval: 0,
    fetcher: async () => {
      return fetch(`${REGISTRY}/${info.fullname}/${info.spec}/files${path}/?meta`)
        .then((res) => res.json())
        .then((res) => {
          if (res.error) {
            return Promise.reject(res.error);
          }
          sortFiles(res.files);
          return Promise.resolve(res);
        });
    }
  });
};

export const useFileContent = (info: PkgInfo, path: string) => {
  return useSwr(`file: ${info.fullname}_${info.spec || 'latest'}_${path}`, async () => {
    return fetch(`${REGISTRY}/${info.fullname}/${info.spec}/files${path}`).then((res) =>
      res.text(),
    );
  });
};
