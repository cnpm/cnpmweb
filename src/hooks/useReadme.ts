'use client';
import useSwr from 'swr';
export function useReadme(pkgName: string, version = 'latest') {
  const { data: content } = useSwr(pkgName ? pkgName + version : null, {
    fetcher: async () => {
      const keys = [
        'README.md',
        'README',
        'readme.md',
        'readme',
      ];
      return Promise.all(
        keys.map(async (key) => {
          const r = await fetch(
            `https://registry.npmmirror.com/${pkgName}/${version}/files/${key}`,
            {
              credentials: 'include',
              mode: 'cors',
              redirect: 'follow',
            },
          );
          return r.status === 200 ? r.text() : null;
        }),
      ).then((res) => {
        const files = res.filter((readme) => !!readme);
        // 肯定只有一个 readme
        return files.length ? files[0] : {};
      });
    },
  });
  return content;
}
