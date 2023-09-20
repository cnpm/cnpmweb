import { PackageManifest } from "@/hooks/useManifest";
import { isEqual } from "lodash";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  try {

    const { pkgName, spec } = req.query;

    const [pkg] = await Promise.all([
      fetch(`https://registry.npmmirror.com/${pkgName}/${spec}`, {
        cache: 'no-store',
      }).then((res) => res.json()),
    ]);

    if (!pkg.name) {
      res.status(404).json({});
      return;
    }

    res.status(200).json({ version: pkg.version });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e });
  }
}
