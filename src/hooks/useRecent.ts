'use client';
import { useEffect, useState } from 'react';

const LOCAL_STORAGE_RECENT = 'recent';

export function useRecent() {
  const [recent, setRecent] = useState<string[] | undefined>(undefined);

  useEffect(() => {
    const recentInfo = localStorage?.getItem(LOCAL_STORAGE_RECENT);
    if (recentInfo) {
      setRecent(JSON.parse(recentInfo));
    } else {
      setRecent([]);
    }
  }, []);

  useEffect(() => {
    if (recent) {
      localStorage.setItem(LOCAL_STORAGE_RECENT, JSON.stringify(recent.slice(0, 10)));
    }
  }, [recent]);

  return [recent, setRecent] as [typeof recent, typeof setRecent];
}
