'use client';
import React from 'react';

export interface SizeContainerProps {
  maxWidth: string | number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function SizeContainer({
  maxWidth,
  children,
  className,
  style,
}: SizeContainerProps) {
  return (
    <div
      className={className}
      style={{
        maxWidth,
        margin: '48px auto 48px',
        padding: '0 16px',
        marginTop: '32px',
        width: '100%',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
