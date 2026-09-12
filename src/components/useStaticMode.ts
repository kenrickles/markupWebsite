'use client';

import { useEffect, useState } from 'react';

/**
 * useStaticMode — returns true when animations should be skipped entirely:
 *  - URL contains ?static=1 (deterministic screenshots / print / e2e)
 *  - prefers-reduced-motion
 * Components render their final state immediately when true.
 */
export function useStaticMode(): boolean {
  const [isStatic, setIsStatic] = useState(true); // SSR-safe default: no animation flash

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const staticParam = params.get('static') === '1';
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setIsStatic(staticParam || reduce);
  }, []);

  return isStatic;
}
