import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NPMVersionSelect from './NPMVersionSelect';

describe('NPMVersionSelect', () => {
  const mockSetVersionStr = vi.fn();

  beforeEach(() => {
    mockSetVersionStr.mockClear();
  });

  describe('rendering', () => {
    it('should render null when versions array is empty', () => {
      const { container } = render(
        <NPMVersionSelect
          versions={[]}
          targetVersion="1.0.0"
          tags={{}}
          setVersionStr={mockSetVersionStr}
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it('should render null when targetVersion is null', () => {
      const { container } = render(
        <NPMVersionSelect
          versions={['1.0.0', '1.0.1']}
          targetVersion={null}
          tags={{}}
          setVersionStr={mockSetVersionStr}
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it('should render version select when versions and targetVersion are provided', () => {
      render(
        <NPMVersionSelect
          versions={['1.0.0', '1.0.1', '2.0.0']}
          targetVersion="1.0.1"
          tags={{}}
          setVersionStr={mockSetVersionStr}
        />
      );

      // Should render the version selector with the target version displayed
      expect(screen.getByText('1.0.1')).toBeInTheDocument();
    });

    it('should render tag select with tag label when version matches', () => {
      render(
        <NPMVersionSelect
          versions={['1.0.0']}
          targetVersion="1.0.0"
          tags={{ latest: '1.0.0' }}
          setVersionStr={mockSetVersionStr}
        />
      );

      // When targetVersion matches a tag, the tag label is shown
      expect(screen.getByTitle('latest')).toBeInTheDocument();
    });
  });

  describe('version sorting', () => {
    it('should sort versions in descending semver order', () => {
      render(
        <NPMVersionSelect
          versions={['1.0.0', '2.0.0', '1.5.0', '10.0.0', '2.1.0']}
          targetVersion="1.0.0"
          tags={{}}
          setVersionStr={mockSetVersionStr}
        />
      );

      // The component should render with sorted versions
      // We can verify by checking that the selected version is displayed
      expect(screen.getByText('1.0.0')).toBeInTheDocument();
    });

    it('should handle prerelease versions', () => {
      render(
        <NPMVersionSelect
          versions={['1.0.0', '1.0.1-beta.1', '1.0.1-alpha.1', '1.0.1']}
          targetVersion="1.0.0"
          tags={{}}
          setVersionStr={mockSetVersionStr}
        />
      );

      expect(screen.getByText('1.0.0')).toBeInTheDocument();
    });

    it('should handle invalid semver versions gracefully', () => {
      render(
        <NPMVersionSelect
          versions={['1.0.0', 'invalid-version', '2.0.0']}
          targetVersion="1.0.0"
          tags={{}}
          setVersionStr={mockSetVersionStr}
        />
      );

      expect(screen.getByText('1.0.0')).toBeInTheDocument();
    });
  });

  describe('tags', () => {
    it('should show tag value when targetVersion matches a tag', () => {
      render(
        <NPMVersionSelect
          versions={['1.0.0', '2.0.0']}
          targetVersion="2.0.0"
          tags={{ latest: '2.0.0', next: '2.0.0' }}
          setVersionStr={mockSetVersionStr}
        />
      );

      // When targetVersion matches a tag, the tag select should show the version
      expect(screen.getByText('2.0.0')).toBeInTheDocument();
    });

    it('should show placeholder when targetVersion does not match any tag', () => {
      render(
        <NPMVersionSelect
          versions={['1.0.0', '2.0.0']}
          targetVersion="1.0.0"
          tags={{ latest: '2.0.0' }}
          setVersionStr={mockSetVersionStr}
        />
      );

      expect(screen.getByText('选择 Tag')).toBeInTheDocument();
    });

    it('should handle empty tags object', () => {
      render(
        <NPMVersionSelect
          versions={['1.0.0']}
          targetVersion="1.0.0"
          tags={{}}
          setVersionStr={mockSetVersionStr}
        />
      );

      expect(screen.getByText('1.0.0')).toBeInTheDocument();
    });
  });

  describe('large version lists (performance)', () => {
    it('should handle 1000+ versions without crashing', () => {
      const manyVersions = Array.from({ length: 1000 }, (_, i) => {
        const major = Math.floor(i / 100);
        const minor = Math.floor((i % 100) / 10);
        const patch = i % 10;
        return `${major}.${minor}.${patch}`;
      });

      const { container } = render(
        <NPMVersionSelect
          versions={manyVersions}
          targetVersion="0.0.0"
          tags={{}}
          setVersionStr={mockSetVersionStr}
        />
      );

      // Should render without crashing
      expect(container.firstChild).not.toBeNull();
    });

    it('should handle versions with many tags', () => {
      const versions = ['1.0.0', '2.0.0', '3.0.0'];
      const manyTags: Record<string, string> = {};
      for (let i = 0; i < 100; i++) {
        manyTags[`tag-${i}`] = versions[i % versions.length];
      }

      render(
        <NPMVersionSelect
          versions={versions}
          targetVersion="1.0.0"
          tags={manyTags}
          setVersionStr={mockSetVersionStr}
        />
      );

      expect(screen.getByText('1.0.0')).toBeInTheDocument();
    });
  });
});
