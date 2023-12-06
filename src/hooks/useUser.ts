import { REGISTRY } from '@/config';
import useSwr from 'swr';
import { PackageManifest } from './useManifest';

export default function useUser(user?: string) {
  return useSwr(user ? `user:${user}` : null, async () => {
    const pkgRes = await fetch(`${REGISTRY}/-/org/npm:${user}/package`);

    if (pkgRes.ok === false) {
      return {
        pkgs: [],
        user: {
          name: user,
          email: '',
        },
      };
    }

    const pkgs = Object.keys(await pkgRes.json()).map(_ => ({ name: _ }));
    const pkgInfo = await fetch(`${REGISTRY}/${pkgs[0].name}`).then(res => res.json()) as PackageManifest;
    const email = pkgInfo?.maintainers?.find(m => m.name === user)?.email;

    return {
      pkgs,
      user: {
        name: user,
        email,
      },
    };
  });
}
