'use client'
import { useEffect, useState } from 'react';
import useSWR from 'swr';

export interface SearchResult {
  objects: SearchItem[]
  total: number
}

export interface SearchItem {
  package: SearchPackageResult
  downloads: Downloads
}

export type SearchResultWithPage<T> = {
  data: T[];
  page: {
    total: number;
    current: number;
    pageSize: number;
  };
};

export interface SearchPackageResult {
  name: string
  version: string
  _rev: string
  scope: string
  keywords: string[]
  versions: string[]
  description: string
  license: string
  maintainers: Maintainer[]
  author: Author
  "dist-tags": Record<string, string>;
  date: Date;
  created: string
  modified: string
  _source_registry_name: string
  _npmUser: NpmUser
  publish_time?: number
}

export interface Maintainer {
  username: string
  name: string
  email: string
}

export interface Author {
  name: string
  email?: string
  url?: string
}

export interface NpmUser {
  name: string
  email: string
}

export interface Downloads {
  all: number
}


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
  const res = await fetch(`https://registry.npmmirror.com/-/v1/search?text=${k}&size=12&from=${(p - 1) * 12}`, {
    method: 'GET',
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

  return useSWR<SearchResult>(debouncedKeyword ? [debouncedKeyword, page] : null, fetcher);
}
