import React from 'react';

interface PolicyProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export const PolicyLayout = ({ title, subtitle, children }: PolicyProps) => {
  return (
    <div className="bg-bone min-h-screen pt-40 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <span className="text-[10px] uppercase tracking-[0.5em] text-taupe">{subtitle}</span>
          <h1 className="text-4xl md:text-5xl font-serif italic text-espresso">{title}</h1>
        </div>
        <div className="prose prose-sm max-w-none text-espresso/80 leading-relaxed uppercase tracking-widest text-[11px] space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
};