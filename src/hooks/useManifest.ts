import React, { useMemo } from 'react';
import useSwr from 'swr';
import dayjs from 'dayjs';
import { REGISTRY } from '@/config';

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export interface NpmPackageVersion {
  name: string;
  version: string;
  dist?: {
    tarball: string;
    size: string;
  };
  publish_time: number | string;
  keywords: string[];
  deprecated?: string;
  _npmUser: Record<string, string>;
  _cnpmcore_publish_time: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

export type PackageManifest = {
  name: string;
  maintainers: { name: string; email: string }[];
  keywords?: string[];
  description: string;
  _source_registry_name: string;
  versions: Record<string, NpmPackageVersion>;
  'dist-tags': Record<string, string>;
  license?: string;
  repository?: {
    type: string;
    url: string;
  };
  homepage?: string;
  readme?: string;
};

export function useVersions(manifest: PackageManifest): NpmPackageVersion[] {
  return React.useMemo(() => {
    const versions = [...Object.values(manifest.versions || {})];
    const patchedVersions = versions.map((item) => {
      if (item.publish_time) {
        return item;
      }
      return {
        ...item,
        publish_time: new Date(item._cnpmcore_publish_time || item.publish_time).valueOf(),
      };
    });
    return patchedVersions.sort((a, b) => (dayjs(a.publish_time).isAfter(b.publish_time) ? -1 : 1));
  }, [manifest]);
}

export function useVersionTags(manifest: PackageManifest) {
  return React.useMemo(() => {
    const tagsMap = manifest['dist-tags'];
    const versions = Object.values(tagsMap);
    const tags = Object.keys(tagsMap);
    const res: Record<string, string[]> = {};
    versions.forEach((v) => {
      res[v] = tags.filter((tag) => tagsMap[tag] === v);
    });
    return res;
  }, [manifest]);
}

export function useInfo(pkgName: string | undefined) {
  return useSwr(pkgName ? `info: ${pkgName}` : null, async () => {
    const target = `${REGISTRY}/${pkgName}`;
    const res = await fetch(target.toString());
    if (res.status === 404) {
      throw new NotFoundError(`Not Found ${pkgName}`);
    }

    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    return res.json();
  });
}

export function useSpec(
  pkgName: string | undefined,
  spec: string | undefined,
  info: PackageManifest | undefined,
) {
  const needFetch = useMemo(() => {
    return pkgName && spec && !info?.versions?.[spec];
  }, [pkgName, spec, info]);
  return useSwr(needFetch ? `spec: ${pkgName}_${spec}` : null, async () => {
    const target = `${REGISTRY}/${pkgName || ''}/${spec}`;
    const res = await fetch(target.toString());
    if (res.status === 404) {
      throw new NotFoundError(`Not Found ${pkgName}@${spec}`);
    }

    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    return res.json();
  });
}
