
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const sizes = {
  sm: {
    container: 'h-8',
    text: 'text-xl',
  },
  md: {
    container: 'h-10',
    text: 'text-2xl',
  },
  lg: {
    container: 'h-12',
    text: 'text-3xl',
  },
};

export const NexusForgeLogo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className,
}) => {
  const sizeConfig = sizes[size as keyof typeof sizes];

  return (
    <Link href="/" className={cn('flex items-center', className)}>
      <div className={cn('relative flex items-center', sizeConfig.container)}>
        <div className="relative h-full aspect-square">
          <Image
            src="/images/logo.svg"
            alt="Nexus Forge Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        {showText && (
          <div className={cn('ml-2 font-bold tracking-tight', sizeConfig.text)}>
            <span className="text-primary">Nexus</span>{' '}
            <span className="text-muted-foreground dark:text-gray-300">Forge</span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default NexusForgeLogo;
