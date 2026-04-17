"use client";
import React, { useState, useEffect } from 'react';
import { PolicyLayout } from '../../../components/ui/PolicyLayout';
import { createClient } from '../../../lib/supabase/client';

export default function ShippingPage() {
  const supabase = createClient();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    setMounted(true);

    const fetchShipping = async () => {
      const { data: config } = await supabase
        .from('site_config')
        .select('content')
        .eq('key', 'shipping_policy')
        .single();

      if (config?.content) {
        setData(config.content);
      }
      setLoading(false);
    };

    fetchShipping();

    const channel = supabase
      .channel('shipping-updates')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'site_config', filter: 'key=eq.shipping_policy' },
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
    title: "Sevkiyat ve Teslimat",
    subtitle: "CURA Konseyerj Servisi",
    processingTime: "1-3 iş günü",
    moscowFreeThreshold: "5000",
    standardDeliveryCost: "250",
    internationalText: "Dünya çapında gönderim sağlıyoruz. Uluslararası teslimat süreleri ve gümrük süreçleri hakkında detaylı bilgi için lütfen ekibimizle iletişime geçin.",
    courierText: "Siparişiniz onaylandıktan sonra hazırlık süresi:"
  };

  return (
    <PolicyLayout title={displayData.title} subtitle={displayData.subtitle}>
      <div className="space-y-16 animate-in fade-in slide-in-from-bottom-3 duration-1000">
        
        <section>
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-espresso font-bold uppercase text-[10px] tracking-[0.3em]">Kurye ile Teslimat</h2>
            <div className="h-[1px] flex-1 bg-gold/20" />
          </div>
          <p className="text-[14px] leading-relaxed text-espresso/70 font-light max-w-2xl">
            {displayData.courierText} <span className="text-gold font-medium italic serif underline decoration-gold/30 underline-offset-4">{displayData.processingTime}</span>. 
            Her bir cura Studio parçası final kalite kontrolünden geçer ve el işçiliği ile paketlenir.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 border border-taupe/10 bg-white/40 backdrop-blur-sm group hover:border-gold/30 transition-colors duration-500">
            <h3 className="text-[9px] uppercase tracking-[0.2em] text-taupe mb-2">Standart Gönderim</h3>
            <p className="text-[22px] font-serif italic text-espresso">
              {Number(displayData.standardDeliveryCost).toLocaleString()} TL
            </p>
          </div>

          <div className="p-8 border border-gold/20 bg-gold/[0.03] backdrop-blur-sm relative overflow-hidden group hover:bg-gold/[0.06] transition-all duration-700">
             <div className="absolute top-0 right-0 p-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
             </div>
            <h3 className="text-[9px] uppercase tracking-[0.2em] text-gold mb-2 font-semibold">Ayrıcalıklı</h3>
            <p className="text-[22px] font-serif italic text-espresso">Ücretsiz</p>
            <p className="text-[11px] text-espresso/60 mt-4 leading-relaxed font-light">
              <span className="text-gold font-medium">{Number(displayData.moscowFreeThreshold).toLocaleString()} TL</span> üzerindeki siparişlerde.
            </p>
          </div>
        </section>

        <section className="pt-12 border-t border-taupe/10">
          <div className="flex flex-col md:flex-row gap-12 items-start justify-between">
            <div className="max-w-xl">
              <h2 className="text-espresso font-bold mb-6 uppercase text-[10px] tracking-[0.4em]">Küresel Teslimat</h2>
              <p className="text-[13px] leading-relaxed text-espresso/80 font-light italic font-serif">
                "{displayData.internationalText}"
              </p>
            </div>
            <a href="https://t.me/curaStudio" target="_blank" className="text-[10px] uppercase tracking-[0.5em] text-gold border border-gold/30 px-10 py-5 hover:bg-gold hover:text-white transition-all duration-700">
              Atölye ile İletişime Geç
            </a>
          </div>
        </section>
      </div>
    </PolicyLayout>
  );
}