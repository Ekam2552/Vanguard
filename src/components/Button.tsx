import React from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export const Button = ({ children, href, variant = 'primary', className, ...props }: ButtonProps) => {
  const baseClasses = clsx(
    "group relative inline-flex items-center justify-between rounded-full px-6 py-3 font-medium transition-all duration-700 ease-[var(--ease-custom)] active:scale-[0.98]",
    variant === 'primary' ? "bg-white text-black hover:bg-white/90" : "bg-white/5 text-white ring-1 ring-white/10 hover:bg-white/10 backdrop-blur-md",
    className
  );

  const iconWrapperClasses = clsx(
    "flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-700 ease-[var(--ease-custom)] group-hover:-translate-y-[1px] group-hover:translate-x-1 group-hover:scale-105 ml-4 -mr-3",
    variant === 'primary' ? "bg-black/10" : "bg-white/10"
  );

  const Content = (
    <>
      <span className="text-sm tracking-wide">{children}</span>
      <div className={iconWrapperClasses}>
        <ArrowUpRight weight="light" className="h-4 w-4" />
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {Content}
      </Link>
    );
  }

  return (
    <button className={baseClasses} {...props}>
      {Content}
    </button>
  );
};
