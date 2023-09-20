import { PackageManifest } from "@/hooks/useManifest";
import { isEqual } from "lodash";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  try {

    const { pkgName } = req.query;

    const [pkg, sourceRegistryInfo] = await Promise.all([
      fetch(`https://registry.npmmirror.com/${pkgName}`, {
        cache: 'no-store',
      }).then((res) => res.json()),
      fetch(`https://registry.npmjs.org/${pkgName}`, {
        cache: 'no-store',
        headers: {
          'Accept': 'application/vnd.npm.install-v1+json',
        },
      }).then(
        (res) => res.json()
      ),
    ]);

    // dist-tag 一致，版本也一致，就认为不需要同步
    const alreadySync =
      isEqual(pkg?.['dist-tags'], sourceRegistryInfo?.['dist-tags']) &&
      isEqual(
        Object.keys(pkg?.versions || {}).sort(),
        Object.keys(sourceRegistryInfo?.versions || {}).sort()
      );

    if (!pkg.name) {
      res.status(404).json({});
      return;
    }

    // 剪裁一下 pkg 的数据
    const {
      versions,
      maintainers = null,
      repository = null,
    } = pkg as PackageManifest;
    const simpleVersions: Record<string, Partial<PackageManifest['versions'][string]>> = {};

    Object.entries(versions).forEach(([version, data]) => {
      simpleVersions[version] = {
        version: data.version,
        dist: {
          tarball: data?.dist?.tarball || '',
          size: data?.dist?.size || '0',
        },
        publish_time: data.publish_time || data._cnpmcore_publish_time || 0,
        _npmUser: data._npmUser || null,
      };
    });
    const data = {
      name: pkg.name,
      maintainers,
      description: pkg.description,
      repository,
      'dist-tags': pkg['dist-tags'],
      versions: simpleVersions,
      keywords: pkg.keywords,
      homepage: pkg.homepage,
    };

    res.status(200).json({ data, needSync: !alreadySync });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e });
  }
}
