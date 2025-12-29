'use client';
import { isEmpty } from 'lodash';
import { Select } from 'antd';
import React from 'react';

import semver from 'semver';

// Simple version sorting - compare by semver descending
function sortVersions(versions: string[]): string[] {
  return [...versions].sort((a, b) => {
    const aClean = semver.clean(a);
    const bClean = semver.clean(b);
    if (aClean && bClean) {
      return semver.rcompare(aClean, bClean);
    }
    const aVersion = semver.coerce(a);
    const bVersion = semver.coerce(b);
    if (aVersion && bVersion) {
      return semver.rcompare(aVersion, bVersion);
    }
    return 0;
  });
}

// Build flat version options for Select with virtual scrolling
function buildVersionOptions(versions: string[]): { label: string; value: string }[] {
  const sorted = sortVersions(versions);
  return sorted.map(v => ({ label: v, value: v }));
}

interface VersionSelectProps {
  versions: string[];
  targetVersion: string | null;
  tags: Record<string, string>;
  setVersionStr: (newValue: string) => void;
}

export default function NPMVersionSelect({
  versions,
  targetVersion,
  tags = {},
  setVersionStr,
}: VersionSelectProps) {
  // Memoize version options - flat list for virtual scrolling
  const versionOptions = React.useMemo(() => {
    return buildVersionOptions(versions);
  }, [versions]);

  // Memoize tag options
  const tagOptions = React.useMemo(() => {
    return Object.keys(tags || {}).map((t) => ({ label: t, value: tags[t] }));
  }, [tags]);

  const hasTag = React.useMemo(() => {
    if (!targetVersion) {
      return false;
    }
    return Object.values(tags).includes(targetVersion);
  }, [tags, targetVersion]);

  if (isEmpty(versionOptions) || !targetVersion) {
    return null;
  }

  return (
    <>
      <Select
        size="small"
        options={versionOptions}
        value={targetVersion}
        allowClear={false}
        style={{ width: 'auto', minWidth: 100 }}
        showSearch
        virtual
        listHeight={300}
        popupMatchSelectWidth={false}
        onChange={(val) => {
          setVersionStr(val);
        }}
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
      />
      <Select
        size="small"
        options={tagOptions}
        placeholder="选择 Tag"
        value={hasTag ? targetVersion : undefined}
        popupMatchSelectWidth={180}
        onChange={(val) => {
          setVersionStr(val);
        }}
        showSearch
      />
    </>
  );
}
