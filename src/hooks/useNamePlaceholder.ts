import React from 'react';

const ALPHANUMERIC_PATTERN = /^[a-zA-Z\d]+$/;

export default function useNamePlaceholder(pkg: { name: string }) {
  const placeholder = React.useMemo(() => {
    if (!pkg) {
      return null;
    }
    const cells = (pkg.name || '').split('/');

    const validateStr = cells[cells.length - 1] || '?';
    const first2 = validateStr.substr(0, 2);

    if (ALPHANUMERIC_PATTERN.test(first2)) {
      return `${first2[0].toUpperCase()}${(first2[1] || '').toLowerCase()}`;
    }

    return first2[0].toUpperCase();
  }, [pkg]);
  return placeholder;
}
