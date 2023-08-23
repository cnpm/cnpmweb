import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export function parseHash(hash: string) {
  const singleLineMatch = hash?.match(/^L(\d+)$/);
  const multiLineMatch = hash?.match(/^L(\d+)-L(\d+)$/);
  if (singleLineMatch) {
    const line = parseInt(singleLineMatch[1], 10);
    return [line, line];
  } else if (multiLineMatch) {
    const startLine = parseInt(multiLineMatch[1], 10);
    const endLine = parseInt(multiLineMatch[2], 10);
    return [startLine, endLine];
  }
  return [null, null];
}

export default function useHighlightHash() {
  const router = useRouter();
  const [highlightRange, setHighlightRange] = useState<any>([null, null]);

  useEffect(() => {
    const res = parseHash(router.asPath.split('#')[1]);
    setHighlightRange(res);
  }, [router.asPath]);

  const setHashFromSelection = (start: number, end: number) => {
    const { pathname, search } = window.location;

    if (start === end) {
      router.replace(`${pathname}${search}#L${start}`, undefined, { shallow: true });
    } else {
      router.replace(`${pathname}${search}#L${start}-L${end}`, undefined, { shallow: true });
    }
  };

  return [highlightRange, setHashFromSelection];
}
