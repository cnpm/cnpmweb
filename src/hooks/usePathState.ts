import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';

export function usePathState(pattern: string): [string, (newValue: string) => void] {
  const router = useRouter();
  const regexPattern = useMemo(() => {
    return new RegExp(pattern.replace('*', '(.*)'));
  }, [pattern]);
  const match = router.asPath.match(regexPattern);

  const [state, setState] = useState(match ? match[1] : '');

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      const match = url.match(regexPattern);
      setState(match ? match[1] : '');
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router, regexPattern]);

  const setPathState = (newValue: string) => {
    const newPath = pattern.replace('*', newValue.replace(/^\//, ''));
    router.replace(newPath, newPath, { shallow: true });
  };

  return [state?.split('#')[0], setPathState];
}
