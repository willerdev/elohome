import React from 'react';

interface LinkProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}

export function Link({ href, children, active, className = '' }: LinkProps) {
  return (
    <a
      href={href}
      className={`flex items-center gap-2 text-sm ${
        active ? 'text-[#0487b3]' : 'text-gray-600 hover:text-[#0487b3]'
      } ${className}`}
    >
      {children}
    </a>
  );
}