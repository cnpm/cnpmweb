import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { usePathState } from './usePathState';

const router = vi.hoisted(() => ({
  asPath: '/package/example/files/package.json?version=1.2.3',
  replace: vi.fn(),
  events: { on: vi.fn(), off: vi.fn() },
}));

vi.mock('next/router', () => ({ useRouter: () => router }));

describe('usePathState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each([
    {
      name: 'replaces the path placeholder and removes the leading slash',
      pattern: '/package/example/files/*?version=1.2.3',
      value: '/lib/index.js',
      expected: '/package/example/files/lib/index.js?version=1.2.3',
    },
    {
      name: 'preserves a wildcard version query',
      pattern: '/package/example/files/*?version=*',
      value: '/lib/index.js',
      expected: '/package/example/files/lib/index.js?version=*',
    },
    {
      name: 'preserves replacement tokens in filenames',
      pattern: '/package/example/files/*?version=1.2.3',
      value: '/$&/$$/file.js',
      expected: '/package/example/files/$&/$$/file.js?version=1.2.3',
    },
    {
      name: 'keeps a pattern without a placeholder unchanged',
      pattern: '/package/example/files?version=1.2.3',
      value: '/lib/index.js',
      expected: '/package/example/files?version=1.2.3',
    },
  ])('$name', ({ pattern, value, expected }) => {
    const { result } = renderHook(() => usePathState(pattern));

    act(() => result.current[1](value));

    expect(router.replace).toHaveBeenCalledExactlyOnceWith(expected, expected, { shallow: true });
  });
});
