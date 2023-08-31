'use client';

import { PackageManifest } from "@/hooks/useManifest";
import { Alert, AlertProps, Button, Space } from "antd";
import Sync from "./Sync";

const NPM_REGISTRY = 'https://npmjs.com';

export const REGISTRY_MAP = {
  self: 'https://registry.npmmirror.com',
  default: 'https://registry.npmjs.org',
};

type SyncAlertProps = {
  pkg: PackageManifest;
  needSync?: boolean;
}

export default function SyncAlert({pkg, needSync}: SyncAlertProps) {
  // const registry = useSourceRegistry(pkg!);
  const registry = pkg?._source_registry_name;
  // const { needSync, isLoading } = useNeedSync(pkg!, registry);
  let type: AlertProps['type'] = 'success';
  let message = '所有版本均已同步';
  let sourceLink;
  let description;

  if (registry === 'self') {
    description = `${
      pkg!.name
    } 为私有包，发布流程在 registry.npmmirror.com 上，无需进行同步`;
  } else {
    description = `${pkg!.name} 为公网包，目前会从 registry.npmjs.org 进行同步`;
    sourceLink = `${NPM_REGISTRY}/package/${pkg!.name}?activeTab=versions`;
  }

  if (needSync === true) {
    type = 'warning';
    message = '版本和上游信息不一致';
  }

  if (needSync === undefined) {
    type = 'warning';
    message = '查询源站版本信息失败';
  }

  return (
    <Alert
      message={message}
      description={description}
      type={type}
      showIcon
      action={
        <Space direction='vertical'>
          {needSync && <Sync pkgName={pkg.name} />}
          {registry !== 'self' && (
            <Button
              size='small'
              href={sourceLink}
              type='link'
              target='_blank'
            >
              查看源站
            </Button>
          )}
        </Space>
      }
    />
  );
}
