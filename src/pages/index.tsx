import React from 'react';
import styles from './page.module.css';
import 'antd/dist/reset.css';
import LandingSearch from '@/components/LandingSearch';
import AdBanner from '@/components/AdBanner';
import Footer from '@/components/Footer';
import Introduce from '@/components/Introduce';
import Header from '@/components/Header';
import { useTheme } from '@/hooks/useTheme';
import RecentTrending from '@/components/RecentTrending';
import { ConfigProvider, Flex, theme } from 'antd';
import SizeContainer from '@/components/SizeContainer';
import AdHire from '@/components/AdHire';

export default function Home() {
  const [themeMode, setThemeMode] = useTheme();

  return (
    <ConfigProvider
      theme={{ algorithm: themeMode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm }}
    >
      <AdHire />
      <Header themeMode={themeMode} setThemeMode={setThemeMode} />
      <main className={styles.main}>
        <AdBanner />
        <section className={styles.search}>
          <h1 style={{ fontSize: 48, marginTop: 48 }}>npmmirror 镜像站</h1>
          <LandingSearch />
        </section>
        <SizeContainer maxWidth={1280}>
          <Flex style={{ marginTop: '5rem' }} justify="space-between" align="start" gap={32}>
            <Introduce />
            <RecentTrending />
          </Flex>
        </SizeContainer>
      </main>
      <Footer />
    </ConfigProvider>
  );
}
