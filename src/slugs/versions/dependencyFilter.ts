import npa from 'npm-package-arg';
import semver from 'semver';
import type { NpmPackageVersion } from '@/hooks/useManifest';

const dependencyTypes = [
  'dependencies',
  'devDependencies',
  'optionalDependencies',
  'peerDependencies',
] as const;

export interface DependencyFilter {
  name: string;
  range: string | null;
}

export function parseDependencyFilter(input: string): DependencyFilter | null {
  const query = input.trim();
  if (!query) return null;

  try {
    const spec = npa(query);
    if (!spec.name || (spec.type !== 'range' && spec.type !== 'version')) return null;

    // The leading @ in a scoped name does not introduce a version range.
    const range = query.lastIndexOf('@') > 0 ? spec.rawSpec : null;
    if (range !== null && !semver.validRange(range)) return null;

    return { name: spec.name, range };
  } catch {
    return null;
  }
}

export function getDependencyMatches(version: NpmPackageVersion, filter: DependencyFilter) {
  return dependencyTypes.flatMap((type) => {
    const dependencies = version[type];
    if (!dependencies || !Object.prototype.hasOwnProperty.call(dependencies, filter.name)) {
      return [];
    }

    const spec = dependencies[filter.name];
    if (typeof spec !== 'string') return [];

    if (filter.range !== null) {
      if (!semver.validRange(spec)) return [];

      // Exact versions must satisfy the declared range, including prerelease rules.
      const matches = semver.valid(filter.range)
        ? semver.satisfies(filter.range, spec)
        : semver.intersects(filter.range, spec);
      if (!matches) return [];
    }

    return [{ type, spec }];
  });
}
