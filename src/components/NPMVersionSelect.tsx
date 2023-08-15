'use client';
import { isEmpty } from 'lodash';
import { Cascader, Select, Space } from 'antd';
import React from 'react';

import semver from 'semver';

interface VersionNode {
  label: string;
  value: string;
  children: VersionNode[];
}

function sortNodes(nodes: VersionNode[]): void {
  nodes.sort((a, b) => {
    const aVersion = semver.coerce(a.value);
    const bVersion = semver.coerce(b.value);
    if (!aVersion || !bVersion) {
      return 0;
    }
    return semver.rcompare(aVersion, bVersion);
  });
  for (const node of nodes) {
    sortNodes(node.children);
  }
}

function classifyVersions(versions: string[]): VersionNode[] {
  const root: VersionNode = { label: '', value: '', children: [] };
  const map: Map<string, VersionNode> = new Map();

  for (const version of versions) {
    const parsed = semver.parse(version);
    if (!parsed) {
      continue;
    }

    const major = `${parsed.major}.x`;
    const minor = `${parsed.major}.${parsed.minor}.x`;
    const patch = parsed.version;

    let majorNode = map.get(major);
    if (!majorNode) {
      majorNode = { label: major, value: major, children: [] };
      map.set(major, majorNode);
      root.children.push(majorNode);
    }

    let minorNode = map.get(minor);
    if (!minorNode) {
      minorNode = { label: minor, value: minor, children: [] };
      map.set(minor, minorNode);
      majorNode.children.push(minorNode);
    }

    let patchNode = map.get(patch);
    if (!patchNode) {
      patchNode = { label: patch, value: version, children: [] };
      map.set(patch, patchNode);
      minorNode.children.push(patchNode);
    }
  }

  sortNodes(root.children);

  // 如果只有 0.0.x 的版本
  // 就直接返回 children 不用额外返回 0.x 了
  // 0.x
  if (root.children.length === 1) {
    // 0.0.x
    const childrenNode = root.children[0].children;
    if (childrenNode.length === 1) {
      return childrenNode;
    }
  }
  return root.children;
}

interface VersionSelectProps {
  versions: string[];
  targetVersion: string | null;
  tags: Record<string, string>;
  setVersionStr: (newValue: string) => void;
}

export default function NPMVersionSelect ({
  versions,
  targetVersion,
  tags = {},
  setVersionStr,
}: VersionSelectProps) {
  // Update tag in select label
  const selectVersionRender = React.useMemo(() => {
    const version = targetVersion;
    return <Space>{version}</Space>;
  }, [targetVersion]);

  const targetOptions = React.useMemo(() => {
    return classifyVersions(versions);
  }, [versions]);

  const targetValue = React.useMemo(() => {
    let value: string[] = [];

    function findNode(nodes: VersionNode[] | undefined, prefixs: string[]) {
      if (isEmpty(nodes) || !nodes) {
        return;
      }

      nodes.some((item) => {
        if (item.value === targetVersion) {
          value = [...prefixs, targetVersion];
          return true;
        }
        if (item.children) {
          return findNode(item.children, [...prefixs, item.value]);
        }
        return false;
      });
    }

    findNode(targetOptions, []);
    return value;
  }, [targetOptions, targetVersion]);

  const hasTag = React.useMemo(() => {
    if (!targetVersion) {
      return false;
    }
    return Object.values(tags).includes(targetVersion);
  }, [tags, targetVersion]);

  if (isEmpty(targetOptions) || !targetVersion) {
    return null;
  }

  // 版本选择器
  return !isEmpty(targetOptions) ? (
    <Space style={{ paddingRight: 32 }}>
      <Cascader
        size='small'
        options={targetOptions}
        value={targetValue}
        displayRender={() => selectVersionRender}
        allowClear={false}
        style={{ width: 'unset' }}
        showSearch
        placement={'bottomRight'}
        onChange={(val) => {
          setVersionStr(val?.pop()?.toString() || '');
        }}
      />
      <Select
        size='small'
        options={Object.keys(tags || {}).map((t) => ({ label: t, value: tags[t] }))}
        placeholder='选择 Tag'
        value={hasTag ? targetVersion : undefined}
        popupMatchSelectWidth={180}
        onChange={(val) => {
          setVersionStr(val);
        }}
        showSearch
      />
    </Space>
  ) : null;
};
