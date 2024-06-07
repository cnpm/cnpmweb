import { useState, useEffect, useCallback } from 'react';

function useQueryState(key: string, defaultValue: string): [string, (value: string) => void] {
  const [value, setValue] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get(key) || defaultValue;
  });

  const updateUrl = useCallback((newValue: string | null) => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    if (newValue === defaultValue || newValue == null) {
      params.delete(key);
    } else {
      params.set(key, newValue);
    }

    // 历史状态管理，避免生成新的历史记录条目
    window.history.replaceState({}, '', `${url.pathname}?${params}`);
  }, [key, defaultValue]);

  useEffect(() => {
    if (value !== defaultValue) {
      updateUrl(value);
    } else {
      updateUrl(null);  // 传 null 以移除查询参数
    }
  }, [value, updateUrl, defaultValue]);

  return [value as string, setValue];
}

export default useQueryState;
