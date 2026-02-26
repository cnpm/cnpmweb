import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Viewer from './index';
import { PackageManifest } from '@/hooks/useManifest';

// Mock useDirs hook
const mockUseDirs = vi.fn();
vi.mock('@/hooks/useFile', () => ({
  useDirs: (...args: any[]) => mockUseDirs(...args),
}));

// Mock usePathState hook
vi.mock('@/hooks/usePathState', () => ({
  usePathState: () => ['', vi.fn()],
}));

// Mock CodeViewer
vi.mock('@/components/CodeViewer', () => ({
  CodeViewer: () => <div data-testid="code-viewer">CodeViewer</div>,
}));

// Mock FileTree
vi.mock('@/components/FileTree', () => ({
  FileTree: () => <div data-testid="file-tree">FileTree</div>,
}));

// Mock Sidebar
vi.mock('@/components/Sidebar', () => ({
  Sidebar: ({ children }: { children: React.ReactNode }) => <div data-testid="sidebar">{children}</div>,
}));

const createMockManifest = (name = 'test-package'): PackageManifest => ({
  name,
  maintainers: [],
  description: 'A test package',
  _source_registry_name: 'npm',
  'dist-tags': { latest: '1.0.0' },
  versions: {
    '1.0.0': {
      name,
      version: '1.0.0',
      publish_time: Date.now(),
      keywords: [],
      _npmUser: {},
      _cnpmcore_publish_time: new Date().toISOString(),
    },
  },
});

describe('Files Viewer Component', () => {
  describe('error state', () => {
    it('should display error result with npmx.dev link when useDirs returns an error', () => {
      mockUseDirs.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: '[FORBIDDEN] "vibe-kanban" is not allow to unpkg files',
      });

      const manifest = createMockManifest('vibe-kanban');
      render(<Viewer manifest={manifest} version="0.1.19" />);

      expect(screen.getByText('产物预览失败')).toBeInTheDocument();

      const link = screen.getByRole('link', { name: '在 npmx.dev 上查看代码' });
      expect(link).toHaveAttribute('href', 'https://npmx.dev/package-code/vibe-kanban/v/0.1.19');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should use "latest" as spec when version is not provided', () => {
      mockUseDirs.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: 'some error',
      });

      const manifest = createMockManifest('some-package');
      render(<Viewer manifest={manifest} />);

      const link = screen.getByRole('link', { name: '在 npmx.dev 上查看代码' });
      expect(link).toHaveAttribute('href', 'https://npmx.dev/package-code/some-package/v/latest');
    });

    it('should construct correct npmx.dev link for scoped packages', () => {
      mockUseDirs.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: 'some error',
      });

      const manifest = createMockManifest('@scope/my-package');
      render(<Viewer manifest={manifest} version="2.0.0" />);

      const link = screen.getByRole('link', { name: '在 npmx.dev 上查看代码' });
      expect(link).toHaveAttribute('href', 'https://npmx.dev/package-code/@scope/my-package/v/2.0.0');
    });
  });

  describe('loading state', () => {
    it('should display spinner when loading', () => {
      mockUseDirs.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: undefined,
      });

      const manifest = createMockManifest();
      const { container } = render(<Viewer manifest={manifest} version="1.0.0" />);

      expect(container.querySelector('.ant-spin')).toBeInTheDocument();
    });
  });

  describe('success state', () => {
    it('should display file tree and code viewer when data loads successfully', () => {
      mockUseDirs.mockReturnValue({
        data: { path: '/', type: 'directory', files: [] },
        isLoading: false,
        error: undefined,
      });

      const manifest = createMockManifest();
      render(<Viewer manifest={manifest} version="1.0.0" />);

      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('file-tree')).toBeInTheDocument();
      expect(screen.getByTestId('code-viewer')).toBeInTheDocument();
    });

    it('should not display npmx.dev link when data loads successfully', () => {
      mockUseDirs.mockReturnValue({
        data: { path: '/', type: 'directory', files: [] },
        isLoading: false,
        error: undefined,
      });

      const manifest = createMockManifest();
      render(<Viewer manifest={manifest} version="1.0.0" />);

      expect(screen.queryByText('在 npmx.dev 上查看代码')).not.toBeInTheDocument();
    });
  });
});
