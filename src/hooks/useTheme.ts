import { ThemeMode } from "antd-style";
import { useEffect, useState } from "react";

const LOCAL_STORAGE_THEME = 'themeMode';

export function useTheme() {
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  useEffect(() => {
    const themeMode = localStorage.getItem(LOCAL_STORAGE_THEME) as ThemeMode;
    if (themeMode) {
      setThemeMode(themeMode);
    }
  }, []);
  useEffect(() => {
    document
      .querySelector('html')
      ?.setAttribute('style', `color-scheme: ${themeMode};`);
  }, [themeMode]);

  return [themeMode, (v: ThemeMode) => {
    localStorage.setItem(LOCAL_STORAGE_THEME, v);
    setThemeMode(v);
  }];
}
