import React from 'react';
import styles from './page.module.css';
import LandingSearch from '@/components/LandingSearch';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.search}>
        <h1>cnpmweb</h1>
        <LandingSearch/>
      </div>
    </main>
  );
}
