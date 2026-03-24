"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '../../../../../lib/supabase/client';

export default function ShippingSettingsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [shipping, setShipping] = useState({
    title: "Доставка",
    subtitle: "AETHER Concierge Service",
    processingTime: "1-2 рабочих дня",
    moscowFreeThreshold: "15000",
    standardDeliveryCost: "500",
    internationalText: "Для оформления заказа в другие страны, пожалуйста, свяжитесь с нашим консьерж-сервисом через Telegram.",
    courierText: "Мы предлагаем бережную доставку по всей России. Срок обработки заказа составляет"
  });

  // 1. Load current shipping settings from Supabase
  useEffect(() => {
    async function loadShipping() {
      const { data } = await supabase
        .from('site_config')
        .select('content')
        .eq('key', 'shipping_policy')
        .single();

      if (data) setShipping(data.content);
      setLoading(false);
    }
    loadShipping();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShipping(prev => ({ ...prev, [name]: value }));
  };

  // 2. Save/Upsert to Supabase
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from('site_config')
      .upsert({ 
        key: 'shipping_policy', 
        content: shipping,
        updated_at: new Date().toISOString() 
      }, { onConflict: 'key' });

    if (error) {
      alert("Ошибка при сохранении: " + error.message);
    } else {
      alert("Параметры доставки успешно обновлены");
    }
    setSaving(false);
  };

  if (loading) return <div className="p-20 text-gold animate-pulse text-[10px] tracking-widest uppercase">Загрузка логистики...</div>;

  return (
    <div className="max-w-5xl">
      <div className="mb-12">
        <span className="text-[10px] uppercase tracking-[0.5em] text-gold/60">Логистика</span>
        <h1 className="text-4xl font-serif italic text-bone mt-2">Настройки Доставки</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* GENERAL INFO */}
        <div className="bg-white/5 p-8 border border-gold/10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-widest text-gold/60">Заголовок</label>
            <input name="title" value={shipping.title} onChange={handleChange} className="w-full bg-charcoal border border-gold/20 p-3 text-bone text-xs focus:outline-none focus:border-gold transition-colors" />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-widest text-gold/60">Срок обработки</label>
            <input name="processingTime" value={shipping.processingTime} onChange={handleChange} placeholder="напр. 1-2 рабочих дня" className="w-full bg-charcoal border border-gold/20 p-3 text-bone text-xs focus:outline-none focus:border-gold transition-colors" />
          </div>
        </div>

        {/* PRICING & THRESHOLDS */}
        <div className="bg-white/5 p-8 border border-gold/10">
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-gold mb-6 pb-2 border-b border-gold/10">Стоимость и Лимиты</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-widest text-gold/60">Бесплатно при заказе от (₽)</label>
              <input name="moscowFreeThreshold" type="number" value={shipping.moscowFreeThreshold} onChange={handleChange} className="w-full bg-charcoal border border-gold/20 p-3 text-bone text-xs focus:outline-none focus:border-gold transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-widest text-gold/60">Стандартная доставка (₽)</label>
              <input name="standardDeliveryCost" type="number" value={shipping.standardDeliveryCost} onChange={handleChange} className="w-full bg-charcoal border border-gold/20 p-3 text-bone text-xs focus:outline-none focus:border-gold transition-colors" />
            </div>
          </div>
        </div>

        {/* TEXT CONTENT */}
        <div className="bg-white/5 p-8 border border-gold/10 space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-widest text-gold/60">Международная доставка (Текст)</label>
            <textarea name="internationalText" value={shipping.internationalText} onChange={handleChange} rows={3} className="w-full bg-charcoal border border-gold/20 p-3 text-bone text-[11px] leading-relaxed resize-none focus:outline-none focus:border-gold transition-colors" />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={saving}
          className="w-full bg-gold text-charcoal py-5 text-[10px] font-bold uppercase tracking-[0.5em] hover:bg-white transition-all shadow-xl disabled:opacity-50"
        >
          {saving ? "Синхронизация..." : "Обновить условия доставки"}
        </button>
      </form>
    </div>
  );
}