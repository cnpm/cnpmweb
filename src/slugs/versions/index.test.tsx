import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ReadOnlyVersions from './index';
import { PackageManifest, NpmPackageVersion } from '@/hooks/useManifest';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  },
}));

// Mock SizeContainer
vi.mock('@/components/SizeContainer', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock SyncAlert
vi.mock('@/components/SyncAlert', () => ({
  default: () => null,
}));

// Mock Gravatar
vi.mock('@/components/Gravatar', () => ({
  Gravatar: ({ name }: { name: string }) => <span data-testid="gravatar">{name}</span>,
}));

// Mock VersionTags
vi.mock('@/components/VersionTags', () => ({
  default: ({ tags }: { tags: string[] }) => <span data-testid="version-tags">{tags?.join(', ')}</span>,
}));

// Mock useQueryState - returns 'all' to show all versions including prereleases
vi.mock('@/hooks/useQueryState', () => ({
  default: () => ['all', vi.fn()],
}));

const createMockVersion = (
  version: string,
  publishTime: number,
  options: Partial<NpmPackageVersion> = {}
): NpmPackageVersion => ({
  name: 'test-package',
  version,
  publish_time: publishTime,
  keywords: [],
  _npmUser: options._npmUser || {},
  _cnpmcore_publish_time: new Date(publishTime).toISOString(),
  ...options,
});

const createMockManifest = (
  versions: NpmPackageVersion[],
  distTags: Record<string, string> = { latest: versions[0]?.version || '1.0.0' }
): PackageManifest => {
  const versionsMap: Record<string, NpmPackageVersion> = {};
  versions.forEach((v) => {
    versionsMap[v.version] = v;
  });

  return {
    name: 'test-package',
    maintainers: [],
    description: 'A test package',
    _source_registry_name: 'npm',
    'dist-tags': distTags,
    versions: versionsMap,
  };
};

describe('ReadOnlyVersions Component', () => {
  describe('empty state', () => {
    it('should display empty message when no versions exist', () => {
      const manifest = createMockManifest([]);

      render(<ReadOnlyVersions manifest={manifest} version="1.0.0" />);

      expect(screen.getByText('暂未发布版本')).toBeInTheDocument();
    });
  });

  describe('version list rendering', () => {
    it('should display version records section', () => {
      const versions = [
        createMockVersion('1.0.0', Date.now()),
      ];
      const manifest = createMockManifest(versions);

      render(<ReadOnlyVersions manifest={manifest} version="1.0.0" />);

      expect(screen.getByText('版本记录')).toBeInTheDocument();
    });

    it('should display versions with correct links', () => {
      const now = Date.now();
      const versions = [
        createMockVersion('1.0.0', now),
        createMockVersion('2.0.0', now + 1000),
      ];
      // Use different versions for tags to avoid duplicate links
      const manifest = createMockManifest(versions, { latest: '2.0.0' });

      render(<ReadOnlyVersions manifest={manifest} version="1.0.0" />);

      // Find links in the version list (not in tags list)
      const allLinks = screen.getAllByRole('link');
      const versionListLinks = allLinks.filter((link) =>
        link.getAttribute('href')?.includes('?version=')
      );

      expect(versionListLinks.length).toBeGreaterThanOrEqual(2);
    });

    it('should sort versions by publish time descending', () => {
      const now = Date.now();
      const versions = [
        createMockVersion('1.0.0', now - 2000),
        createMockVersion('2.0.0', now),
        createMockVersion('1.5.0', now - 1000),
      ];
      const manifest = createMockManifest(versions, { latest: '2.0.0' });

      render(<ReadOnlyVersions manifest={manifest} version="1.0.0" />);

      // Find version links in the versions list section
      const allLinks = screen.getAllByRole('link');
      const versionListLinks = allLinks.filter((link) => {
        const href = link.getAttribute('href') || '';
        return href.includes('?version=') && !href.includes('/home');
      });

      // Should be sorted: 2.0.0 (newest), 1.5.0, 1.0.0 (oldest)
      expect(versionListLinks[0]).toHaveTextContent('2.0.0');
      expect(versionListLinks[1]).toHaveTextContent('1.5.0');
      expect(versionListLinks[2]).toHaveTextContent('1.0.0');
    });

    it('should show all versions including prerelease', () => {
      const now = Date.now();
      const versions = [
        createMockVersion('1.0.0', now),
        createMockVersion('2.0.0-beta.1', now + 1000),
      ];
      const manifest = createMockManifest(versions, { latest: '1.0.0' });

      render(<ReadOnlyVersions manifest={manifest} version="1.0.0" />);

      // Use getAllByText since both TagsList and VersionsList may show the prerelease version
      expect(screen.getAllByText('2.0.0-beta.1').length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('pagination', () => {
    it('should not show pagination when versions <= 50', () => {
      const versions = Array.from({ length: 50 }, (_, i) =>
        createMockVersion(`1.0.${i}`, Date.now() + i * 1000)
      );
      const manifest = createMockManifest(versions, { latest: '1.0.49' });

      render(<ReadOnlyVersions manifest={manifest} version="1.0.0" />);

      expect(screen.queryByText(/共.*个版本/)).not.toBeInTheDocument();
    });

    it('should show pagination when versions > 50', () => {
      const versions = Array.from({ length: 60 }, (_, i) =>
        createMockVersion(`1.0.${i}`, Date.now() + i * 1000)
      );
      const manifest = createMockManifest(versions, { latest: '1.0.59' });

      render(<ReadOnlyVersions manifest={manifest} version="1.0.0" />);

      expect(screen.getByText('共 60 个版本')).toBeInTheDocument();
    });

    it('should only render 50 versions per page', () => {
      const versions = Array.from({ length: 100 }, (_, i) =>
        createMockVersion(`1.0.${i}`, Date.now() + i * 1000)
      );
      const manifest = createMockManifest(versions, { latest: '1.0.99' });

      render(<ReadOnlyVersions manifest={manifest} version="1.0.0" />);

      // Find version links in the versions list section (not tags)
      const allLinks = screen.getAllByRole('link');
      const versionListLinks = allLinks.filter((link) => {
        const href = link.getAttribute('href') || '';
        return href.includes('?version=1.0.') && !href.includes('/home');
      });

      expect(versionListLinks.length).toBe(50);
    });
  });

  describe('tags list', () => {
    it('should display current tags section', () => {
      const versions = [
        createMockVersion('1.0.0', Date.now()),
      ];
      const manifest = createMockManifest(versions, { latest: '1.0.0' });

      render(<ReadOnlyVersions manifest={manifest} version="1.0.0" />);

      expect(screen.getByText('当前 Tags')).toBeInTheDocument();
    });

    it('should display tag with correct link', () => {
      const versions = [
        createMockVersion('1.0.0', Date.now()),
      ];
      const manifest = createMockManifest(versions, { latest: '1.0.0', next: '1.0.0' });

      render(<ReadOnlyVersions manifest={manifest} version="1.0.0" />);

      // Tags are displayed as version links
      const tagLinks = screen.getAllByRole('link').filter(
        (link) => link.getAttribute('href')?.includes('/home?version=')
      );
      expect(tagLinks.length).toBeGreaterThan(0);
    });
  });

  describe('large version list (performance)', () => {
    it('should handle 1000+ versions without crashing', () => {
      const versions = Array.from({ length: 1000 }, (_, i) => {
        const major = Math.floor(i / 100);
        const minor = Math.floor((i % 100) / 10);
        const patch = i % 10;
        return createMockVersion(`${major}.${minor}.${patch}`, Date.now() + i * 1000);
      });
      const manifest = createMockManifest(versions);

      const startTime = performance.now();
      render(<ReadOnlyVersions manifest={manifest} version="0.0.0" />);
      const renderTime = performance.now() - startTime;

      // Should render in under 1 second (actual should be much faster with pagination)
      expect(renderTime).toBeLessThan(1000);
      expect(screen.getByText('版本记录')).toBeInTheDocument();
      expect(screen.getByText('共 1000 个版本')).toBeInTheDocument();
    });
  });

  describe('deprecated versions', () => {
    it('should display deprecated versions with strikethrough element', () => {
      const versions = [
        createMockVersion('1.0.0', Date.now(), { deprecated: 'This version is deprecated' }),
      ];
      const manifest = createMockManifest(versions, { latest: '1.0.0' });

      render(<ReadOnlyVersions manifest={manifest} version="1.0.0" />);

      // Find the link in the version list
      const allLinks = screen.getAllByRole('link');
      const versionLink = allLinks.find((link) => {
        const href = link.getAttribute('href') || '';
        return href.includes('?version=1.0.0') && !href.includes('/home');
      });

      expect(versionLink).toBeInTheDocument();
      // Check that it's wrapped in a <del> element (strikethrough)
      expect(versionLink?.closest('del')).toBeInTheDocument();
    });
  });

  describe('user info', () => {
    it('should display publisher info when available', () => {
      const versions = [
        createMockVersion('1.0.0', Date.now(), {
          _npmUser: { name: 'test-user', email: 'test@example.com' },
        }),
      ];
      const manifest = createMockManifest(versions, { latest: '1.0.0' });

      render(<ReadOnlyVersions manifest={manifest} version="1.0.0" />);

      expect(screen.getByTestId('gravatar')).toHaveTextContent('test-user');
      expect(screen.getByText('由')).toBeInTheDocument();
      expect(screen.getByText('发布于')).toBeInTheDocument();
    });
  });
});
