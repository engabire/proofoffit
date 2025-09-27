'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '../lib/utils';

type Variant = 'primary' | 'secondary' | 'subtle' | 'ghost' | 'link';
type Size = 'md' | 'lg';

export type CtaProps = {
  id?: string;
  label: string;
  href?: string;                // if set, renders <a> via next/link
  onClick?: (e: React.MouseEvent) => void;
  variant?: Variant;
  size?: Size;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  ariaLabel?: string;
  prefetch?: boolean;
  // analytics / context
  'data-evt'?: string;
  'data-lane'?: 'seeker' | 'employer' | string;
  className?: string;
};

const base =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed';

const variants: Record<Variant, string> = {
  primary:
    'rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 shadow',
  secondary:
    'rounded-xl border border-slate-300 bg-white text-slate-900 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900',
  subtle:
    'rounded-xl bg-slate-50 text-slate-900 hover:bg-slate-100 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800',
  ghost:
    'rounded-xl text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-900',
  link:
    'rounded-none px-0 underline decoration-slate-400 underline-offset-4 hover:decoration-slate-600 dark:decoration-slate-500 dark:hover:decoration-slate-300'
};

const sizes: Record<Size, string> = {
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-3 text-base'
};

function emitCta(detail: Record<string, unknown>) {
  try {
    // Broadcast for your app to listen & forward to analytics
    globalThis.dispatchEvent?.(new CustomEvent('cta:click', { detail }));
  } catch {}
  try {
    // Optional direct gtag (SSR-safe)
    (globalThis as any).gtag?.('event', 'cta_click', detail);
  } catch {}
}

function Spinner() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 animate-spin">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" opacity=".2" />
      <path d="M22 12a10 10 0 0 1-10 10" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function Cta(props: CtaProps) {
  const {
    id, label, href, onClick, variant = 'primary', size = 'md',
    iconLeft, iconRight, disabled, loading, ariaLabel, prefetch = true,
    className, ...data
  } = props;

  const classes = cn(base, variants[variant], sizes[size], className);

  const handle = (e: React.MouseEvent) => {
    emitCta({
      id, label, href, variant, size,
      lane: (data as any)['data-lane'] || undefined,
      evt: (data as any)['data-evt'] || undefined,
      path: typeof location !== 'undefined' ? location.pathname : ''
    });
    onClick?.(e);
  };

  const contents = (
    <>
      {loading ? <Spinner /> : iconLeft}
      <span>{label}</span>
      {iconRight}
    </>
  );

  if (href && !disabled) {
    return (
      <Link
        id={id}
        href={href}
        prefetch={prefetch}
        aria-label={ariaLabel || label}
        className={classes}
        data-cta="true"
        {...data}
        onClick={handle}
      >
        {contents}
      </Link>
    );
  }

  return (
    <button
      id={id}
      type="button"
      aria-label={ariaLabel || label}
      className={classes}
      onClick={handle}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      data-cta="true"
      {...data}
    >
      {contents}
    </button>
  );
}

export default Cta;