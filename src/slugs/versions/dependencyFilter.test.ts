import { describe, expect, it } from 'vitest';
import type { NpmPackageVersion } from '@/hooks/useManifest';
import { getDependencyMatches, parseDependencyFilter } from './dependencyFilter';

describe('parseDependencyFilter', () => {
  it.each([
    ['webpack', { name: 'webpack', range: null }],
    [' @babel/core ', { name: '@babel/core', range: null }],
    ['webpack@3.0.0', { name: 'webpack', range: '3.0.0' }],
    ['webpack@^3.0.0', { name: 'webpack', range: '^3.0.0' }],
    ['@babel/core@~7.2.0', { name: '@babel/core', range: '~7.2.0' }],
    ['webpack@>=3 <4 || ^5', { name: 'webpack', range: '>=3 <4 || ^5' }],
    ['webpack@*', { name: 'webpack', range: '*' }],
  ])('parses %s', (input, expected) => {
    expect(parseDependencyFilter(input)).toEqual(expected);
  });

  it.each([
    '',
    ' ',
    '@scope',
    'invalid name',
    'webpack@latest',
    'webpack@^nope',
    'file:../webpack',
    'webpack@npm:other@^3',
  ])('rejects %s', (input) => {
    expect(parseDependencyFilter(input)).toBeNull();
  });
});

describe('getDependencyMatches', () => {
  const createVersion = (dependencies: Partial<NpmPackageVersion>): NpmPackageVersion => ({
    name: 'test-package',
    version: '1.0.0',
    publish_time: 0,
    keywords: [],
    _npmUser: {},
    _cnpmcore_publish_time: '',
    dependencies: {},
    devDependencies: {},
    ...dependencies,
  });

  it.each([
    ['3.5.0', '^3.0.0', true],
    ['3.0.0', '^3.6.0', false],
    ['^3.0.0', '^3.6.0', true],
    ['~3.0.0', '^3.6.0', false],
    ['^3.0.0', '^4.0.0', false],
    ['>=3 <4 || ^5', '~5.2.0', true],
    ['3.x', '3.2.1', true],
    ['3.2.1', '*', true],
    ['3.2.1-beta.1', '^3.0.0', false],
    ['3.2.1-beta.1', '^3.2.1-beta.0', true],
    ['^3', 'latest', false],
    ['^3', 'file:../webpack', false],
    ['^3', 'git+https://github.com/webpack/webpack.git', false],
    ['^3', 'npm:webpack@^3', false],
  ])('matches %s against %s: %s', (range, spec, expected) => {
    const version = createVersion({ dependencies: { webpack: spec } });
    expect(getDependencyMatches(version, { name: 'webpack', range }).length > 0).toBe(expected);
  });

  it('finds all four dependency types without merging their ranges', () => {
    const version = createVersion({
      dependencies: { webpack: '^4.0.0' },
      devDependencies: { webpack: '^3.0.0' },
      optionalDependencies: { webpack: '~3.2.0' },
      peerDependencies: { webpack: '>=3 <4' },
    });

    expect(getDependencyMatches(version, { name: 'webpack', range: '3.2.1' })).toEqual([
      { type: 'devDependencies', spec: '^3.0.0' },
      { type: 'optionalDependencies', spec: '~3.2.0' },
      { type: 'peerDependencies', spec: '>=3 <4' },
    ]);
  });

  it('matches scoped names and non-semver specs when no range is given', () => {
    const version = createVersion({ dependencies: { '@scope/pkg': 'file:../pkg' } });

    expect(getDependencyMatches(version, { name: '@scope/pkg', range: null })).toEqual([
      { type: 'dependencies', spec: 'file:../pkg' },
    ]);
    expect(getDependencyMatches(version, { name: 'pkg', range: null })).toEqual([]);
  });

  it('ignores absent dependencies and inherited properties', () => {
    const version = createVersion({ dependencies: undefined, devDependencies: undefined });
    expect(getDependencyMatches(version, { name: 'webpack', range: '^3' })).toEqual([]);
    expect(getDependencyMatches(createVersion({}), { name: 'toString', range: null })).toEqual([]);
  });
});
