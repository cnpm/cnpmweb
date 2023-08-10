import React from "react";
import { orderBy } from 'lodash';

export interface NpmPackageVersion {
  name: string;
  version: string;
  dist: Record<string, number | string>;
  publish_time: number;
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
  description: string;
  _source_registry_name: string;
  versions: Record<
    string,
    NpmPackageVersion
  >;
  'dist-tags': Record<string, string>;
  license?: string;
  repository?: {
    type: string;
    url: string;
  };
};


export function useVersions(manifest: PackageManifest): NpmPackageVersion[] {
  return React.useMemo(() => {
    const versions = [...Object.values(manifest.versions)];
    const patchedVersions = versions.map((item) => {
      if (item.publish_time) {
        return item;
      }
      return {
        ...item,
        publish_time: new Date(item._cnpmcore_publish_time).valueOf(),
      };
    });
    return orderBy(patchedVersions, 'publish_time', 'desc');
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
