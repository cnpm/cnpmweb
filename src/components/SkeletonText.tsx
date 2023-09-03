import { Skeleton, Typography } from 'antd';
import React from 'react';

export default function SkeletonText(
  props: any & { loading: boolean; width: number },
) {
  const { loading, width, style, ...restProps } = props;
  if (loading) {
    const newStyle = {
      width,
      height: 16,
      lineHeight: '16px',
      ...style,
    };
    return (
      <Skeleton.Input {...restProps} style={newStyle} active size="small" />
    );
  }
  return (
    <Typography.Text {...restProps} style={{ maxWidth: '100%', ...style }} />
  );
}
