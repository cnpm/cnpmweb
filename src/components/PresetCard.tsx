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
      color: ${token.colorTextLabel};
      font-size: 16px;
      letter-spacing: 0;
    `,
    subTitle: css`
      color: ${token.colorTextSecondary};
      font-size: 14px;
      letter-spacing: 0;
    `,
  };
});

export interface PresetCardProps {
  children?: React.ReactNode;
  title?: React.ReactNode;
  style?: React.CSSProperties;
  subTitle?: React.ReactNode;
}

export default function PresetCard({
  title,
  subTitle,
  children,
  style = {},
}: PresetCardProps) {

  const { styles } = useStyles();
  return (
    <div className={styles.container} style={style}>
      {title && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <Typography.Title
            level={3}
            className={styles.title}
            style={{ fontSize: 16, marginBottom: 0, flex: 1 }}
          >
            {title}
          </Typography.Title>
          <Typography.Text
            style={{ fontSize: 14, marginBottom: 0, marginTop: 0 }}
            className={styles.subTitle}
          >
            {subTitle}
          </Typography.Text>
        </div>
      )}
      {children}
    </div>
  );
}
