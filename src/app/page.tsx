import React from 'react';
import styles from './page.module.css';
import 'antd/dist/reset.css';
import LandingSearch from '@/components/LandingSearch';
import AdBanner from '@/components/AdBanner';
import AdVPS from '@/components/AdVPS';

export default function Home() {
  return (
    <main className={styles.main}>
      <AdBanner />
      <div className={styles.search}>
        <h1>npmmirror 镜像站</h1>
        <LandingSearch />
      </div>
      <div style={{ marginTop: '5rem' }}>
        <AdVPS />
      </div>
    </main>
  );
}
