"use client";
import React, { useState, useEffect } from 'react';
import { PolicyLayout } from '../../../components/ui/PolicyLayout';
import { createClient } from '../../../lib/supabase/client';

export default function SizeGuidePage({ adminData: initialData }: { adminData?: any }) {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState(initialData || {
    title: "Таблица размеров",
    subtitle: "AETHER Fit Guide",
    footerNote: "Если ваши замеры находятся между размерами, мы рекомендуем выбирать больший размер для изделий из шелка.",
    rows: [
      { size: "XS / 40", bust: "80-84", waist: "60-64", hips: "86-90" },
      { size: "S / 42", bust: "84-88", waist: "64-68", hips: "90-94" },
      { size: "M / 44", bust: "88-92", waist: "68-72", hips: "94-98" },
    ]
  });

  useEffect(() => {
    setMounted(true);

    // Sync from Supabase if data wasn't passed from a Server Component
    if (!initialData) {
      const supabase = createClient();
      const fetchSizeGuide = async () => {
        const { data: config } = await supabase
          .from('site_config')
          .select('content')
          .eq('key', 'size_guide')
          .single();

        if (config?.content) {
          setData(config.content);
        }
      };
      fetchSizeGuide();
    }
  }, [initialData]);

  if (!mounted) return <div className="min-h-screen bg-bone" />;

  return (
    <PolicyLayout title={data.title} subtitle={data.subtitle}>
      <div className="overflow-x-auto animate-in fade-in duration-1000">
        <table className="w-full border-collapse border-b border-taupe/20 text-left">
          <thead>
            <tr className="bg-espresso text-bone text-[9px] tracking-[0.3em]">
              <th className="p-5 font-medium uppercase border-r border-white/10">Размер</th>
              <th className="p-5 font-medium uppercase border-r border-white/10 text-center">Грудь (см)</th>
              <th className="p-5 font-medium uppercase border-r border-white/10 text-center">Талия (см)</th>
              <th className="p-5 font-medium uppercase text-center">Бедра (см)</th>
            </tr>
          </thead>
          <tbody className="text-espresso/70 text-[11px] tracking-widest font-light">
            {data.rows.map((row: any, i: number) => (
              <tr 
                key={i} 
                className={`group transition-colors duration-300 border-x border-taupe/10 ${
                  i % 2 !== 0 ? "bg-bone/40" : "bg-white/20"
                } hover:bg-gold/[0.03]`}
              >
                <td className="p-5 border-b border-taupe/10 font-bold text-espresso group-hover:text-gold transition-colors">
                  {row.size}
                </td>
                <td className="p-5 border-b border-taupe/10 text-center border-x border-taupe/5">
                  {row.bust}
                </td>
                <td className="p-5 border-b border-taupe/10 text-center border-r border-taupe/5">
                  {row.waist}
                </td>
                <td className="p-5 border-b border-taupe/10 text-center">
                  {row.hips}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-12 flex items-start gap-4">
        <span className="text-gold text-lg font-serif italic leading-none">!</span>
        <p className="italic text-taupe text-[11px] leading-loose tracking-wide font-light max-w-xl">
          {data.footerNote}
        </p>
      </div>

      {/* Decorative Atelier Signature */}
      <div className="mt-20 pt-10 border-t border-taupe/10 flex justify-between items-center opacity-40">
        <span className="text-[8px] uppercase tracking-[0.5em]">AETHER Studio Archive</span>
        <span className="text-[8px] uppercase tracking-[0.5em]">2026 Edition</span>
      </div>
    </PolicyLayout>
  );
}