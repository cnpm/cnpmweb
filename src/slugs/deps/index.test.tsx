import React from 'react';
import { render, screen } from '@testing-library/react';
import Deps from './index';
import { PackageManifest } from '@/hooks/useManifest';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock SizeContainer
jest.mock('@/components/SizeContainer', () => {
  return ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
});

const createMockManifest = (
  versionData: Partial<{
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
    optionalDependencies: Record<string, string>;
  }> = {}
): PackageManifest => ({
  name: 'test-package',
  maintainers: [],
  description: 'A test package',
  _source_registry_name: 'npm',
  'dist-tags': { latest: '1.0.0' },
  versions: {
    '1.0.0': {
      name: 'test-package',
      version: '1.0.0',
      publish_time: Date.now(),
      keywords: [],
      _npmUser: {},
      _cnpmcore_publish_time: new Date().toISOString(),
      dependencies: versionData.dependencies || {},
      devDependencies: versionData.devDependencies || {},
      optionalDependencies: versionData.optionalDependencies,
    },
  },
});

describe('Deps Component', () => {
  describe('optionalDependencies', () => {
    it('should display optionalDependencies section', () => {
      const manifest = createMockManifest({
        optionalDependencies: {
          'fsevents': '^2.3.0',
        },
      });

      render(<Deps manifest={manifest} version="1.0.0" />);

      expect(screen.getByText('OptionalDependencies (1)')).toBeInTheDocument();
      expect(screen.getByText('fsevents')).toBeInTheDocument();
      expect(screen.getByText('^2.3.0')).toBeInTheDocument();
    });

    it('should display empty optionalDependencies section when none exist', () => {
      const manifest = createMockManifest({
        dependencies: { 'lodash': '^4.17.21' },
      });

      render(<Deps manifest={manifest} version="1.0.0" />);

      expect(screen.getByText('OptionalDependencies (0)')).toBeInTheDocument();
    });

    it('should display multiple optionalDependencies', () => {
      const manifest = createMockManifest({
        optionalDependencies: {
          'fsevents': '^2.3.0',
          'chokidar': '^3.5.0',
          'esbuild': '^0.19.0',
        },
      });

      render(<Deps manifest={manifest} version="1.0.0" />);

      expect(screen.getByText('OptionalDependencies (3)')).toBeInTheDocument();
      expect(screen.getByText('fsevents')).toBeInTheDocument();
      expect(screen.getByText('chokidar')).toBeInTheDocument();
      expect(screen.getByText('esbuild')).toBeInTheDocument();
    });
  });

  describe('all dependency types together', () => {
    it('should display all three dependency types', () => {
      const manifest = createMockManifest({
        dependencies: {
          'react': '^18.2.0',
          'next': '^13.4.0',
        },
        devDependencies: {
          'typescript': '^5.0.0',
          'jest': '^29.0.0',
          'eslint': '^8.0.0',
        },
        optionalDependencies: {
          'fsevents': '^2.3.0',
        },
      });

      render(<Deps manifest={manifest} version="1.0.0" />);

      expect(screen.getByText('Dependencies (2)')).toBeInTheDocument();
      expect(screen.getByText('DevDependencies (3)')).toBeInTheDocument();
      expect(screen.getByText('OptionalDependencies (1)')).toBeInTheDocument();
    });

    it('should handle missing version data gracefully', () => {
      const manifest = createMockManifest({});
      // Remove the version data
      manifest.versions = {};

      render(<Deps manifest={manifest} version="1.0.0" />);

      expect(screen.getByText('Dependencies (0)')).toBeInTheDocument();
      expect(screen.getByText('DevDependencies (0)')).toBeInTheDocument();
      expect(screen.getByText('OptionalDependencies (0)')).toBeInTheDocument();
    });
  });

  describe('dependency links', () => {
    it('should create correct links for optionalDependencies', () => {
      const manifest = createMockManifest({
        optionalDependencies: {
          'fsevents': '^2.3.0',
        },
      });

      render(<Deps manifest={manifest} version="1.0.0" />);

      const link = screen.getByRole('link', { name: 'fsevents' });
      expect(link).toHaveAttribute('href', '/package/fsevents?version=%5E2.3.0');
    });
  });
});
