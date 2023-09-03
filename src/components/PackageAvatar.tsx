import useNamePlaceholder from '@/hooks/useNamePlaceholder';
import { Skeleton } from 'antd';
import React from 'react';
import styles from './PackageAvatar.module.css';
import { SearchPackageResult } from '@/hooks/useSearch';

export default function PackageAvatar({
  package: pkg,
  size,
  bordered = false,
  loading = false,
}: {
  package: SearchPackageResult;
  size: number;
  bordered?: boolean;
  loading?: boolean;
}) {
  const placeholder = useNamePlaceholder(pkg) || '';
  const defaultClassOrder = React.useMemo(() => {
    try {
      return (
        placeholder
          .split('')
          .map((item: string) => item.charCodeAt(0))
          .reduce((a: number, b: number) => a + b, 0) % 8
      );
    } catch (e) {
      return 0;
    }
  }, [placeholder]);

  if (loading) {
    return <Skeleton.Avatar shape="square" size={size} />;
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        textAlign: 'center',
        lineHeight: `${size}px`,
        borderRadius: 4,
        backgroundSize: '100%',
        border: bordered ? '1px solid rgba(49,70,89,0.08)' : 'none',
        display: 'inline-block',
        verticalAlign: 'top',
      }}
      className={ styles[`placeholder${defaultClassOrder}`]}
    >
      {placeholder}
    </div>
  );
}
