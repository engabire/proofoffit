'use client';

import { useEffect } from 'react';
import { setupCtaBridge } from '@/lib/analytics';

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => { 
    setupCtaBridge(); 
  }, []);
  
  return <>{children}</>;
}