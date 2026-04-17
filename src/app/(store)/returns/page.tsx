"use client";
import React, { useState, useEffect } from 'react';
import { PolicyLayout } from '../../../components/ui/PolicyLayout';
import { createClient } from '../../../lib/supabase/client';

export default function ReturnsPage() {
  const supabase = createClient();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    setMounted(true);

    const fetchPolicy = async () => {
      const { data: config } = await supabase
        .from('site_config')
        .select('content')
        .eq('key', 'returns_policy')
        .single();

      if (config?.content) {
        setData(config.content);
      }
      setLoading(false);
    };

    fetchPolicy();

    const channel = supabase
      .channel('returns-updates')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'site_config', filter: 'key=eq.returns_policy' },
        (payload) => {
          if (payload.new && (payload.new as any).content) {
            setData((payload.new as any).content);
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [supabase]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-bone flex items-center justify-center">
        <div className="w-4 h-4 rounded-full bg-gold animate-ping" />
      </div>
    );
  }

  // Turkish Fallback Content
  const displayData = data || {
    title: "İade ve Değişim",
    subtitle: "varda Kalite Güvencesi",
    conditionsText: "Ürünlerimizi teslim aldığınız tarihten itibaren 14 gün içinde, kullanılmamış ve orijinal etiketleri üzerinde olması kaydıyla iade edebilirsiniz.",
    exceptionsText: "Hijyen kuralları gereği iç giyim ve kişiselleştirilmiş ürünlerde iade kabul edilmemektedir.",
    defectPolicy: "Üretim kaynaklı bir kusur olması durumunda, tüm değişim ve kargo masrafları tarafımıza aittir.",
    conciergeEmail: "concierge@varda.studio",
    telegramHandle: "@vardastudio"
  };

  return (
    <PolicyLayout title={displayData.title} subtitle={displayData.subtitle}>
      <section className="space-y-8 animate-in fade-in duration-1000">
        
        {/* Conditions Section */}
        <div>
          <h2 className="text-[11px] uppercase tracking-[0.3em] text-espresso font-bold mb-4">İade Koşulları</h2>
          <p className="text-[13px] leading-relaxed text-espresso/80 font-light">
            {displayData.conditionsText}
          </p>
        </div>

        {/* Exceptions Box */}
        <div className="bg-white/60 p-8 border border-taupe/10 italic relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gold/30" />
          <p className="text-[12px] text-espresso/70 leading-relaxed">
            <span className="text-gold not-italic mr-2">✦</span>
            {displayData.exceptionsText}
          </p>
        </div>

        {/* Defect Policy */}
        <div>
          <h2 className="text-[11px] uppercase tracking-[0.3em] text-espresso font-bold mb-4">Kusurlu Ürün Politikası</h2>
          <p className="text-[13px] leading-relaxed text-espresso/80 font-light">
            {displayData.defectPolicy}
          </p>
        </div>

        {/* Process Steps */}
        <div>
          <h2 className="text-[11px] uppercase tracking-[0.3em] text-espresso font-bold mb-4">İşlem Süreci</h2>
          <ol className="space-y-4 text-[13px] text-espresso/80 font-light">
            <li className="flex gap-4 items-start">
              <span className="text-gold/50 font-serif italic text-lg leading-none">01</span>
              <span>Ürünün ve orijinal etiketlerinin gün ışığında net fotoğraflarını çekin.</span>
            </li>
            <li className="flex gap-4 items-start">
              <span className="text-gold/50 font-serif italic text-lg leading-none">02</span>
              <span>
                Sipariş numaranızla birlikte <span className="text-gold font-medium border-b border-gold/20 pb-0.5">{displayData.conciergeEmail}</span> adresine e-posta gönderin.
              </span>
            </li>
            <li className="flex gap-4 items-start">
              <span className="text-gold/50 font-serif italic text-lg leading-none">03</span>
              <span>Konseyerj servisimizden 24 saat içinde onay onayı bekleyin.</span>
            </li>
          </ol>
        </div>

        {/* Footer Contact */}
        <div className="pt-12 border-t border-taupe/20 text-center">
          <p className="text-[9px] text-taupe tracking-[0.5em] uppercase">
            Konseyerj Desteği: {displayData.telegramHandle}
          </p>
        </div>
      </section>
    </PolicyLayout>
  );
}