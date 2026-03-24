"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '../../../../../lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function ReturnsSettingsPage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [data, setData] = useState({
    title: "Возврат и Обмен",
    subtitle: "AETHER Quality Assurance",
    conditionsText: "В соответствии с законодательством РФ, нижнее белье и чулочно-носочные изделия надлежащего качества не подлежат возврату или обмену. Мы просим вас внимательно проверять заказ при получении.",
    exceptionsText: "Исключение составляют изделия из категорий 'Silk' (пижамы, халаты) и 'Atelier' (верхняя одежда), если они не относятся к нательному белью.",
    defectPolicy: "Если вы обнаружили производственный дефект, пожалуйста, свяжитесь с нами в течение 24 часов после получения заказа. Мы произведем замену или полный возврат средств.",
    conciergeEmail: "concierge@aether.studio",
    telegramHandle: "@AetherConcierge"
  });

  useEffect(() => {
    async function loadReturnsPolicy() {
      const { data: config } = await supabase
        .from('site_config')
        .select('content')
        .eq('key', 'returns_policy')
        .single();

      if (config?.content) {
        setData(config.content);
      }
      setLoading(false);
    }
    loadReturnsPolicy();
  }, [supabase]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from('site_config')
      .upsert({ 
        key: 'returns_policy', 
        content: data,
        updated_at: new Date().toISOString() 
      }, { onConflict: 'key' });

    if (error) {
      alert("Error saving: " + error.message);
    } else {
      router.refresh(); // Clears Next.js cache
      alert("Returns protocols updated successfully.");
    }
    setSaving(false);
  };

  if (loading) return <div className="p-20 text-gold text-[10px] tracking-widest uppercase text-center animate-pulse">Synchronizing Returns Policy...</div>;

  return (
    <div className="max-w-5xl p-8 animate-in fade-in duration-700">
      <div className="mb-12 border-b border-gold/10 pb-8">
        <span className="text-[10px] uppercase tracking-[0.5em] text-gold/60">Legal & Quality Control</span>
        <h1 className="text-4xl font-serif italic text-bone mt-2">Returns & Exchanges</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* HEADER SECTION */}
        <div className="bg-white/5 p-8 border border-gold/10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[9px] uppercase tracking-widest text-gold/60">Page Title</label>
            <input name="title" value={data.title} onChange={handleChange} className="w-full bg-charcoal border border-gold/20 p-4 text-bone text-xs focus:border-gold outline-none transition-all" />
          </div>
          <div className="space-y-3">
            <label className="text-[9px] uppercase tracking-widest text-gold/60">Subtitle</label>
            <input name="subtitle" value={data.subtitle} onChange={handleChange} className="w-full bg-charcoal border border-gold/20 p-4 text-bone text-xs focus:border-gold outline-none transition-all" />
          </div>
        </div>

        {/* POLICY TEXT SECTION */}
        <div className="bg-white/5 p-8 border border-gold/10 space-y-8">
          <div className="space-y-3">
            <label className="text-[9px] uppercase tracking-widest text-gold/60">Main Conditions (Law of RF)</label>
            <textarea name="conditionsText" value={data.conditionsText} onChange={handleChange} rows={4} className="w-full bg-charcoal border border-gold/20 p-4 text-bone text-[11px] leading-relaxed resize-none focus:border-gold outline-none transition-all" />
          </div>
          
          <div className="space-y-3">
            <label className="text-[9px] uppercase tracking-widest text-gold/60">Exceptions (Silk & Atelier Categories)</label>
            <textarea name="exceptionsText" value={data.exceptionsText} onChange={handleChange} rows={3} className="w-full bg-charcoal border border-gold/20 p-4 text-gold/70 italic text-[11px] leading-relaxed resize-none focus:border-gold outline-none transition-all font-serif" />
          </div>

          <div className="space-y-3">
            <label className="text-[9px] uppercase tracking-widest text-gold/60">Defect & Replacement Policy</label>
            <textarea name="defectPolicy" value={data.defectPolicy} onChange={handleChange} rows={3} className="w-full bg-charcoal border border-gold/20 p-4 text-bone text-[11px] leading-relaxed resize-none focus:border-gold outline-none transition-all" />
          </div>
        </div>

        {/* CONTACT SECTION */}
        <div className="bg-white/5 p-8 border border-gold/10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[9px] uppercase tracking-widest text-gold/60">Concierge Email Address</label>
            <input name="conciergeEmail" value={data.conciergeEmail} onChange={handleChange} className="w-full bg-charcoal border border-gold/20 p-4 text-bone text-xs focus:border-gold outline-none" />
          </div>
          <div className="space-y-3">
            <label className="text-[9px] uppercase tracking-widest text-gold/60">Telegram Handle</label>
            <input name="telegramHandle" value={data.telegramHandle} onChange={handleChange} className="w-full bg-charcoal border border-gold/20 p-4 text-bone text-xs focus:border-gold outline-none" />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={saving}
          className="w-full bg-gold text-charcoal py-6 text-[11px] font-bold uppercase tracking-[0.6em] hover:bg-white transition-all disabled:opacity-50 shadow-xl"
        >
          {saving ? "Updating Legal Protocols..." : "Publish Returns Policy"}
        </button>
      </form>
    </div>
  );
}