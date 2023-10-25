import React from 'react';
import styles from './page.module.css';
import 'antd/dist/reset.css';
import LandingSearch from '@/components/LandingSearch';
import AdBanner from '@/components/AdBanner';
import AdVPS from '@/components/AdVPS';
import Footer from '@/components/Footer';
import Introduce from '@/components/Introduce';
import { ThemeMode, ThemeProvider as _ThemeProvider } from 'antd-style';
import Header from '@/components/Header';
import { useTheme } from '@/hooks/useTheme';
import AdHire from '@/components/AdHire';

const ThemeProvider = _ThemeProvider as any;

export default function Home() {
  const [themeMode, setThemeMode] = useTheme();

  return (
    <ThemeProvider themeMode={themeMode as ThemeMode}>
      <AdHire />
      <Header themeMode={themeMode} setThemeMode={setThemeMode} />
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
    </ThemeProvider>
  );
}
