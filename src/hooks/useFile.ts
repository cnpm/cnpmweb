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
  path?: string;
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

export const useDirs = (info: PkgInfo) => {
  return useSwr(`dirs: ${info.fullname}_${info.spec}`, async () => {
    return fetch(`${REGISTRY}/${info.fullname}/${info.spec}/files?meta`)
      .then((res) => res.json())
      .then((res) => {
        sortFiles(res.files);
        return Promise.resolve(res);
      });
  });
};

export const useFileContent = (info: PkgInfo, path: string) => {
  return useSwr(`file: ${info.fullname}_${info.spec || 'latest'}_${path}`, async () => {
    return fetch(`${REGISTRY}/${info.fullname}/${info.spec}/files${path}`).then((res) =>
      res.text(),
    );
  });
};

export const getDir = (info: PkgInfo): Promise<File | Directory>  => {
  return fetch(`${REGISTRY}/${info.fullname}/${info.spec}/files`)
    .then((res) => res.json())
    .then((res) => {
      return Promise.resolve(res);
    });
};

export const getFileContent = (info: PkgInfo, path: string) => {
  return fetch(`${REGISTRY}/${info.fullname}/${info.spec}/files${path}`).then((res) => res.text());
};
