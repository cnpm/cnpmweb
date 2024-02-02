import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

type QueryValue = string | boolean | number;

function useQueryState<T extends QueryValue>(
  key: string,
  defaultValue: T,
  ignoreValues: QueryValue[] = []
): [T, (newValue: T) => void] {
  const router = useRouter();
  const [state, setState] = useState<T>(() => {
    const valueFromQuery = router.isReady ? router.query[key] : undefined;
    return parseValue(valueFromQuery, defaultValue);
  });

  useEffect(() => {
    if (!router.isReady) return;
    const valueFromQuery = router.query[key];
    setState(parseValue(valueFromQuery, defaultValue));
  }, [router.isReady, router.query, key, defaultValue]);

  useEffect(() => {
    const handleRouteChange = () => {
      const valueFromQuery = router.query[key];
      setState(parseValue(valueFromQuery, defaultValue));
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events, key, defaultValue]);

  const setQueryState = (newValue: T) => {
    const newQuery = { ...router.query };

    if (ignoreValues.includes(newValue) || newValue === defaultValue) {
      delete newQuery[key];
    } else {
      newQuery[key] = stringifyValue(newValue) as string;
    }

    router.push({ pathname: router.pathname, query: newQuery }, undefined, { shallow: true });
    setState(newValue);
  };

  return [state, setQueryState];
}

function parseValue<T extends QueryValue>(value: string | string[] | undefined, defaultValue: T): T {
  if (value === undefined || Array.isArray(value)) return defaultValue;
  if (value === 'true') return true as T;
  if (value === 'false') return false as T;
  if (!isNaN(Number(value))) return Number(value) as T;
  return value as unknown as T;
}

function stringifyValue(value: QueryValue): string {
  if (typeof value === 'boolean' || typeof value === 'number') return String(value);
  return value as string;
}

export default useQueryState;
