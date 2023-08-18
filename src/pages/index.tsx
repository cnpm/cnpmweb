import React from 'react';
import styles from './page.module.css';
import 'antd/dist/reset.css';
import LandingSearch from '@/components/LandingSearch';
import AdBanner from '@/components/AdBanner';
import AdVPS from '@/components/AdVPS';
import Footer from '@/components/Footer';
import Introduce from '@/components/Introduce';

export default function Home() {
  return (
    <>
      <main className={styles.main}>
        <AdBanner />
        <div className={styles.search}>
          <h1 style={{ fontSize: 48, marginTop: 48 }}>npmmirror 镜像站</h1>
          <LandingSearch />
          <Introduce />
        </div>
        <div style={{ marginTop: '5rem' }}>
          <AdVPS />
        </div>
      </main>
      <Footer />
    </>
  );
}
