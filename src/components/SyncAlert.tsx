'use client';

import { PackageManifest } from '@/hooks/useManifest';
import { useNpmVersionCompare } from '@/hooks/useNpmVersionCompare';
import { Alert, AlertProps, Button, Space, Spin } from 'antd';
import Sync from './Sync';
import { REGISTRY } from '@/config';

const NPM_REGISTRY = 'https://npmjs.com';

export const REGISTRY_MAP = {
  self: REGISTRY,
  default: 'https://registry.npmjs.org',
};

type SyncAlertProps = {
  pkg: PackageManifest;
};

export default function SyncAlert({ pkg }: SyncAlertProps) {
  const registry = pkg?._source_registry_name;
  const { needSync, isLoading, missingVersions, tagsDiff } = useNpmVersionCompare(pkg);

  let type: AlertProps['type'] = 'success';
  let message: React.ReactNode = '所有版本均已同步';
  let sourceLink;
  let description: React.ReactNode;

  if (registry === 'self') {
    description = `${pkg!.name} 为私有包，发布流程在 registry.npmmirror.com 上，无需进行同步`;
  } else {
    description = `${pkg!.name} 为公网包，目前会从 registry.npmjs.org 进行同步`;
    sourceLink = `${NPM_REGISTRY}/package/${pkg!.name}?activeTab=versions`;
  }

  if (isLoading) {
    type = 'info';
    message = (
      <Space>
        <Spin size="small" />
        <span>正在比对上游版本...</span>
      </Space>
    );
  } else if (needSync) {
    type = 'warning';
    message = '版本和上游信息不一致';

    const details: string[] = [];
    if (missingVersions.length > 0) {
      const displayVersions =
        missingVersions.length > 3
          ? `${missingVersions.slice(0, 3).join(', ')} 等 ${missingVersions.length} 个版本`
          : missingVersions.join(', ');
      details.push(`缺失版本: ${displayVersions}`);
    }
    if (tagsDiff.length > 0) {
      const tagDetails = tagsDiff
        .map((d) => `${d.tag}: 本地 ${d.local || '无'} / 上游 ${d.npm || '无'}`)
        .join('; ');
      details.push(`Tags 差异: ${tagDetails}`);
    }
    if (details.length > 0) {
      description = details.join(' | ');
    }
  }

  return (
    <Alert
      message={message}
      description={description}
      type={type}
      showIcon
      action={
        <Space direction="vertical">
          {<Sync pkgName={pkg.name} />}
          {registry !== 'self' && (
            <Button size="small" href={sourceLink} type="link" target="_blank">
              查看源站
            </Button>
          )}
        </Space>
      }
    />
  );
}
