'use client';
import { Typography } from 'antd';
import React from 'react';
import styles from './PresetCard.module.css';

export interface PresetCardProps {
  children?: React.ReactNode;
  title?: React.ReactNode;
  style?: React.CSSProperties;
}

export default function PresetCard({
  title,
  children,
  style = {},
}: PresetCardProps) {
  return (
    <div className={styles.container} style={style}>
      {title && (
        <Typography.Title
          level={3}
          className={styles.title}
          style={{ fontSize: 16, marginBottom: '1rem' }}
        >
          {title}
        </Typography.Title>
      )}
      {children}
    </div>
  );
}
