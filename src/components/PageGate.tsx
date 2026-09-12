'use client';

import { useState } from 'react';
import BootSequence from './BootSequence';

/**
 * PageGate — B1 gate: plays the boot sequence on first visit,
 * then reveals the page content beneath.
 */
export default function PageGate({ children }: { children: React.ReactNode }) {
  const [booted, setBooted] = useState(false);
  return (
    <>
      <BootSequence onDone={() => setBooted(true)} />
      <div
        className={`transition-opacity duration-700 ${booted ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden={!booted}
      >
        {children}
      </div>
    </>
  );
}
