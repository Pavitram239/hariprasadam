import React from 'react';

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
  light?: boolean;
}

export default function SectionHeading({
  badge,
  title,
  subtitle,
  centered = true,
  className = '',
  light = false,
}: SectionHeadingProps) {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : 'text-left'} ${className}`}>
      {badge && (
        <div className="inline-flex items-center space-x-2 mb-3">
          <span className="h-[1px] w-6 bg-[#C59B3F]" />
          <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#C59B3F]">
            {badge}
          </span>
          <span className="h-[1px] w-6 bg-[#C59B3F]" />
        </div>
      )}
      <h2
        className={`font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight leading-tight ${
          light ? 'text-[#FAF8F5]' : 'text-[#1A1412]'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-3 text-base sm:text-lg max-w-2xl font-normal leading-relaxed ${
            centered ? 'mx-auto' : ''
          } ${light ? 'text-[#FAF8F5]/80' : 'text-[#63574E]'}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
