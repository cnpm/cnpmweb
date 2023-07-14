'use client'
import { useEffect, useState } from 'react';
import useSWR from 'swr';


const APP_ID = process.env.NEXT_PUBLIC_APP_ID;
const APP_KEY = process.env.NEXT_PUBLIC_APP_KEY;

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

async function fetcher([k, p]: [string, number]) {
  const res = await fetch(`https://${APP_ID}-dsn.algolia.net/1/indexes/npm-search/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Algolia-API-Key': APP_KEY || '',
      'X-Algolia-Application-Id': APP_ID || '',
    },
    body: JSON.stringify(
      { "params": `query=${k}&hitsPerPage=12&page=${p}` }
    ),
  });
  return await res.json();
}

export function useCachedSearch({
  keyword,
  page = 0,
}: {
  keyword: string;
  page?: number;
}) {
  const debouncedKeyword = useDebounce(keyword, 300);

  return useSWR([debouncedKeyword, page], fetcher);
}
