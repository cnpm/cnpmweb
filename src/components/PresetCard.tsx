'use client';
import { Typography } from 'antd';
import React from 'react';
import { createStyles } from 'antd-style';

const useStyles = createStyles(({ token, css }) => {
  return {
    container: css`
      position: relative;
      padding: 20px 24px;
      overflow: hidden;
      border: 1px solid ${token.colorBorder};
      border-radius: 8px;
      box-shadow: ${token.boxShadowTertiary};
      background: ${token.colorBgContainer};
    `,
    title: css`
      margin-bottom: 24px;
      color: ${token.colorTextLabel};
      font-size: 16px;
      line-height: 22px;
      letter-spacing: 0;
    `,
  };
});

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

  const { styles } = useStyles();
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
