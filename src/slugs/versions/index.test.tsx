import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, it, expect, vi } from 'vitest';
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
  default: ({ tags }: { tags: string[] }) => (
    <span data-testid="version-tags">{tags?.join(', ')}</span>
  ),
}));

const createMockVersion = (
  version: string,
  publishTime: number,
  options: Partial<NpmPackageVersion> = {},
): NpmPackageVersion => ({
  name: 'test-package',
  version,
  publish_time: publishTime,
  keywords: [],
  _npmUser: options._npmUser || {},
  _cnpmcore_publish_time: new Date(publishTime).toISOString(),
  dependencies: {},
  devDependencies: {},
  ...options,
});

const createMockManifest = (
  versions: NpmPackageVersion[],
  distTags: Record<string, string> = { latest: versions[0]?.version || '1.0.0' },
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
  beforeEach(() => {
    window.history.replaceState({}, '', '/?tags=all&versions=all');
  });

  describe('dependency filter', () => {
    const getVersionLinks = () =>
      screen
        .queryAllByRole('link', { hidden: true })
        .filter((link) => link.getAttribute('href')?.startsWith('/package/test-package?version='));

    const filterBy = (value: string) => {
      fireEvent.change(screen.getByRole('textbox', { name: '按依赖包筛选版本' }), {
        target: { value },
      });
    };

    it('filters releases by dependency range and shows matching declarations and links', () => {
      const versions = [
        createMockVersion('1.0.0', 1000, {
          devDependencies: { webpack: '^3.6.0' },
          peerDependencies: { webpack: '^3.0.0' },
        }),
        createMockVersion('2.0.0', 2000, { dependencies: { webpack: '^4.0.0' } }),
        createMockVersion('3.0.0', 3000),
      ];
      render(<ReadOnlyVersions manifest={createMockManifest(versions)} />);

      filterBy('webpack@^3.0.0');

      expect(getVersionLinks().map((link) => link.textContent)).toEqual(['1.0.0']);
      expect(screen.getByText('devDependencies: webpack@^3.6.0')).toBeInTheDocument();
      expect(screen.getByText('peerDependencies: webpack@^3.0.0')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: '查看完整依赖' })).toHaveAttribute(
        'href',
        '/package/test-package/deps?version=1.0.0',
      );
      expect(screen.getByRole('status')).toHaveTextContent('匹配 1 个版本');
      expect(new URLSearchParams(window.location.search).get('dependency')).toBe('webpack@^3.0.0');
    });

    it('restores a scoped dependency filter from the URL', () => {
      window.history.replaceState({}, '', '/?versions=all&dependency=%40babel%2Fcore%40%5E7');
      const versions = [
        createMockVersion('1.0.0', 1000, { optionalDependencies: { '@babel/core': '^7.2.0' } }),
        createMockVersion('2.0.0', 2000, { dependencies: { '@babel/core': '^8.0.0' } }),
      ];
      render(<ReadOnlyVersions manifest={createMockManifest(versions)} />);

      expect(screen.getByRole('textbox')).toHaveValue('@babel/core@^7');
      expect(getVersionLinks().map((link) => link.textContent)).toEqual(['1.0.0']);
    });

    it('matches any dependency spec by name and restores releases when cleared', () => {
      const versions = [
        createMockVersion('1.0.0', 1000, { dependencies: { webpack: 'file:../webpack' } }),
        createMockVersion('2.0.0', 2000),
      ];
      render(<ReadOnlyVersions manifest={createMockManifest(versions)} />);

      filterBy('webpack');
      expect(getVersionLinks()).toHaveLength(1);
      filterBy('');
      expect(getVersionLinks()).toHaveLength(2);
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      expect(new URLSearchParams(window.location.search).has('dependency')).toBe(false);
    });

    it('shows validation and no-match feedback without hiding current tags', () => {
      render(
        <ReadOnlyVersions manifest={createMockManifest([createMockVersion('1.0.0', 1000)])} />,
      );

      filterBy('webpack@^invalid');
      expect(screen.getByRole('alert')).toHaveTextContent('请输入有效的依赖包名');
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
      expect(getVersionLinks()).toHaveLength(0);

      filterBy('webpack@^3');
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(screen.getByText('没有匹配的版本')).toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveTextContent('匹配 0 个版本');
      expect(screen.getByRole('link', { name: '1.0.0' })).toHaveAttribute(
        'href',
        '/package/test-package/home?version=1.0.0',
      );
    });

    it('combines dependency and prerelease filters', () => {
      const versions = [
        createMockVersion('1.0.0', 1000, { dependencies: { webpack: '^3' } }),
        createMockVersion('2.0.0-beta.1', 2000, { dependencies: { webpack: '^3' } }),
      ];
      render(<ReadOnlyVersions manifest={createMockManifest(versions)} />);
      filterBy('webpack@^3');
      expect(getVersionLinks()).toHaveLength(2);

      fireEvent.click(screen.getAllByRole('radio', { name: '正式版本' })[1]);
      expect(getVersionLinks().map((link) => link.textContent)).toEqual(['1.0.0']);
      expect(screen.getByRole('status')).toHaveTextContent('匹配 1 个版本');
    });

    it('filters before pagination and resets to the first page when the query changes', () => {
      const versions = Array.from({ length: 120 }, (_, i) =>
        createMockVersion(`1.0.${i}`, i + 1, {
          dependencies: i < 60 ? { webpack: '^3.0.0' } : {},
        }),
      );
      render(<ReadOnlyVersions manifest={createMockManifest(versions)} />);
      fireEvent.click(screen.getByTitle('2'));
      expect(getVersionLinks()[0]).toHaveTextContent('1.0.69');

      filterBy('webpack@^3');
      expect(getVersionLinks()).toHaveLength(50);
      expect(getVersionLinks()[0]).toHaveTextContent('1.0.59');
      expect(screen.getByText('共 60 个版本')).toBeInTheDocument();

      fireEvent.click(screen.getByTitle('2'));
      expect(getVersionLinks()).toHaveLength(10);
      expect(getVersionLinks()[0]).toHaveTextContent('1.0.9');
      filterBy('webpack@^4');
      expect(getVersionLinks()).toHaveLength(0);
      expect(screen.queryByText(/共.*个版本/)).not.toBeInTheDocument();

      filterBy('');
      expect(getVersionLinks()[0]).toHaveTextContent('1.0.119');
      expect(screen.getByText('共 120 个版本')).toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('should display empty message when no versions exist', () => {
      const manifest = createMockManifest([]);

      render(<ReadOnlyVersions manifest={manifest} version="1.0.0" />);

      expect(screen.getByText('暂未发布版本')).toBeInTheDocument();
    });
  });

  describe('version list rendering', () => {
    it('should display version records section', () => {
      const versions = [createMockVersion('1.0.0', Date.now())];
      const manifest = createMockManifest(versions);

      render(<ReadOnlyVersions manifest={manifest} version="1.0.0" />);

      expect(screen.getByText('版本记录')).toBeInTheDocument();
    });

    it('should display versions with correct links', () => {
      const now = Date.now();
      const versions = [createMockVersion('1.0.0', now), createMockVersion('2.0.0', now + 1000)];
      // Use different versions for tags to avoid duplicate links
      const manifest = createMockManifest(versions, { latest: '2.0.0' });

      render(<ReadOnlyVersions manifest={manifest} version="1.0.0" />);

      // Find links in the version list (not in tags list)
      const allLinks = screen.getAllByRole('link');
      const versionListLinks = allLinks.filter((link) =>
        link.getAttribute('href')?.includes('?version='),
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
        createMockVersion(`1.0.${i}`, Date.now() + i * 1000),
      );
      const manifest = createMockManifest(versions, { latest: '1.0.49' });

      render(<ReadOnlyVersions manifest={manifest} version="1.0.0" />);

      expect(screen.queryByText(/共.*个版本/)).not.toBeInTheDocument();
    });

    it('should show pagination when versions > 50', () => {
      const versions = Array.from({ length: 60 }, (_, i) =>
        createMockVersion(`1.0.${i}`, Date.now() + i * 1000),
      );
      const manifest = createMockManifest(versions, { latest: '1.0.59' });

      render(<ReadOnlyVersions manifest={manifest} version="1.0.0" />);

      expect(screen.getByText('共 60 个版本')).toBeInTheDocument();
    });

    it('should only render 50 versions per page', () => {
      const versions = Array.from({ length: 100 }, (_, i) =>
        createMockVersion(`1.0.${i}`, Date.now() + i * 1000),
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
      const versions = [createMockVersion('1.0.0', Date.now())];
      const manifest = createMockManifest(versions, { latest: '1.0.0' });

      render(<ReadOnlyVersions manifest={manifest} version="1.0.0" />);

      expect(screen.getByText('当前 Tags')).toBeInTheDocument();
    });

    it('should display tag with correct link', () => {
      const versions = [createMockVersion('1.0.0', Date.now())];
      const manifest = createMockManifest(versions, { latest: '1.0.0', next: '1.0.0' });

      render(<ReadOnlyVersions manifest={manifest} version="1.0.0" />);

      // Tags are displayed as version links
      const tagLinks = screen
        .getAllByRole('link')
        .filter((link) => link.getAttribute('href')?.includes('/home?version='));
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
