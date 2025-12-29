import useSwr from 'swr';
import { PackageManifest } from './useManifest';

const NPM_REGISTRY = 'https://registry.npmjs.org';

export interface NpmVersionCompareResult {
  needSync: boolean;
  isLoading: boolean;
  error?: Error;
  // 缺失的版本列表
  missingVersions: string[];
  // dist-tags 差异
  tagsDiff: { tag: string; local?: string; npm?: string }[];
}

export function useNpmVersionCompare(pkg: PackageManifest | undefined): NpmVersionCompareResult {
  const pkgName = pkg?.name;
  const isPrivate = pkg?._source_registry_name === 'self';

  const { data, isLoading, error } = useSwr(
    pkgName && !isPrivate ? `npm-compare:${pkgName}` : null,
    async () => {
      const res = await fetch(`${NPM_REGISTRY}/${pkgName}?t=${Date.now()}`);
      if (!res.ok) {
        if (res.status === 404) {
          // npm 上不存在此包，不需要同步
          return { needSync: false, missingVersions: [], tagsDiff: [] };
        }
        throw new Error('Failed to fetch npm registry');
      }
      const npmData = await res.json();

      // 比对 versions keys
      const npmVersions = Object.keys(npmData.versions || {});
      const localVersions = Object.keys(pkg?.versions || {});
      const missingVersions = npmVersions.filter((v) => !localVersions.includes(v));

      // 比对 dist-tags
      const npmTags = npmData['dist-tags'] || {};
      const localTags = pkg?.['dist-tags'] || {};
      const allTags = new Set([...Object.keys(npmTags), ...Object.keys(localTags)]);
      const tagsDiff: { tag: string; local?: string; npm?: string }[] = [];

      allTags.forEach((tag) => {
        if (npmTags[tag] !== localTags[tag]) {
          tagsDiff.push({
            tag,
            local: localTags[tag],
            npm: npmTags[tag],
          });
        }
      });

      const needSync = missingVersions.length > 0 || tagsDiff.length > 0;

      return {
        needSync,
        missingVersions,
        tagsDiff,
      };
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1分钟内不重复请求
    },
  );

  // 私有包不需要同步
  if (isPrivate) {
    return {
      needSync: false,
      isLoading: false,
      missingVersions: [],
      tagsDiff: [],
    };
  }

  return {
    needSync: data?.needSync ?? false,
    isLoading,
    error,
    missingVersions: data?.missingVersions ?? [],
    tagsDiff: data?.tagsDiff ?? [],
  };
}
