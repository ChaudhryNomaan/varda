"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '../../../../../lib/supabase/client';

export default function SizeGuideSettingsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [sizeData, setSizeData] = useState({
    title: "Таблица размеров",
    subtitle: "AETHER Fit Guide",
    footerNote: "Если ваши замеры находятся между размерами, мы рекомендуем выбирать больший размер для изделий из шелка.",
    rows: [
      { size: "XS / 40", bust: "80-84", waist: "60-64", hips: "86-90" },
      { size: "S / 42", bust: "84-88", waist: "64-68", hips: "90-94" },
      { size: "M / 44", bust: "88-92", waist: "68-72", hips: "94-98" },
    ]
  });

  // 1. Fetch existing table data
  useEffect(() => {
    async function loadSizeGuide() {
      const { data } = await supabase
        .from('site_config')
        .select('content')
        .eq('key', 'size_guide')
        .single();

      if (data) setSizeData(data.content);
      setLoading(false);
    }
    loadSizeGuide();
  }, []);

  const handleRowChange = (index: number, field: string, value: string) => {
    const updatedRows = [...sizeData.rows];
    updatedRows[index] = { ...updatedRows[index], [field]: value };
    setSizeData(prev => ({ ...prev, rows: updatedRows }));
  };

  const addRow = () => {
    setSizeData(prev => ({
      ...prev,
      rows: [...prev.rows, { size: "", bust: "", waist: "", hips: "" }]
    }));
  };

  const removeRow = (index: number) => {
    setSizeData(prev => ({
      ...prev,
      rows: prev.rows.filter((_, i) => i !== index)
    }));
  };

  // 2. Save to Supabase
  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('site_config')
      .upsert({ 
        key: 'size_guide', 
        content: sizeData,
        updated_at: new Date().toISOString() 
      }, { onConflict: 'key' });

    if (error) {
      alert("Ошибка: " + error.message);
    } else {
      alert("Таблица размеров успешно синхронизирована");
    }
    setSaving(false);
  };

  if (loading) return <div className="p-20 text-gold animate-pulse text-[10px] tracking-[0.5em] uppercase text-center">Инициализация параметров...</div>;

  return (
    <div className="max-w-6xl">
      <div className="mb-12">
        <span className="text-[10px] uppercase tracking-[0.5em] text-gold/60">Параметры Изделий</span>
        <h1 className="text-4xl font-serif italic text-bone mt-2">Таблица Размеров</h1>
      </div>

      <div className="space-y-8">
        {/* Header Strings */}
        <div className="bg-white/5 p-8 border border-gold/10 grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-widest text-gold/60">Заголовок</label>
            <input 
              value={sizeData.title} 
              onChange={(e) => setSizeData({...sizeData, title: e.target.value})}
              className="w-full bg-charcoal border border-gold/20 p-3 text-bone text-xs focus:outline-none focus:border-gold transition-colors" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-widest text-gold/60">Подзаголовок</label>
            <input 
              value={sizeData.subtitle} 
              onChange={(e) => setSizeData({...sizeData, subtitle: e.target.value})}
              className="w-full bg-charcoal border border-gold/20 p-3 text-bone text-xs focus:outline-none focus:border-gold transition-colors" 
            />
          </div>
        </div>

        {/* Dynamic Table Grid */}
        <div className="bg-white/5 p-8 border border-gold/10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-gold">Спецификация мерок (cm)</h2>
            <button 
              onClick={addRow}
              className="text-[9px] uppercase tracking-widest text-gold border border-gold/30 px-3 py-1.5 hover:bg-gold hover:text-charcoal transition-all"
            >
              + Добавить строку
            </button>
          </div>
          
          <div className="space-y-3">
            {/* Table Header Labels */}
            <div className="grid grid-cols-5 gap-3 px-2 mb-2">
              {['Размер', 'Грудь', 'Талия', 'Бедра', ''].map(label => (
                <span key={label} className="text-[8px] uppercase tracking-[0.2em] text-white/30">{label}</span>
              ))}
            </div>

            {sizeData.rows.map((row, index) => (
              <div key={index} className="grid grid-cols-5 gap-3 items-center group animate-in fade-in slide-in-from-left-2 duration-300">
                <input placeholder="Размер" value={row.size} onChange={(e) => handleRowChange(index, 'size', e.target.value)} className="bg-charcoal border border-gold/10 p-2.5 text-bone text-[11px] focus:border-gold outline-none" />
                <input placeholder="Грудь" value={row.bust} onChange={(e) => handleRowChange(index, 'bust', e.target.value)} className="bg-charcoal border border-gold/10 p-2.5 text-bone text-[11px] focus:border-gold outline-none" />
                <input placeholder="Талия" value={row.waist} onChange={(e) => handleRowChange(index, 'waist', e.target.value)} className="bg-charcoal border border-gold/10 p-2.5 text-bone text-[11px] focus:border-gold outline-none" />
                <input placeholder="Бедра" value={row.hips} onChange={(e) => handleRowChange(index, 'hips', e.target.value)} className="bg-charcoal border border-gold/10 p-2.5 text-bone text-[11px] focus:border-gold outline-none" />
                <button 
                  onClick={() => removeRow(index)} 
                  className="text-red-400/50 hover:text-red-400 text-[9px] uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-all text-left pl-2"
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="bg-white/5 p-8 border border-gold/10 space-y-2">
          <label className="text-[9px] uppercase tracking-widest text-gold/60">Рекомендация по выбору</label>
          <textarea 
            value={sizeData.footerNote} 
            onChange={(e) => setSizeData({...sizeData, footerNote: e.target.value})}
            rows={2} 
            className="w-full bg-charcoal border border-gold/20 p-3 text-bone text-[11px] leading-relaxed resize-none focus:outline-none focus:border-gold" 
          />
        </div>

        <button 
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-gold text-charcoal py-5 text-[10px] font-bold uppercase tracking-[0.5em] hover:bg-white transition-all disabled:opacity-50"
        >
          {saving ? "Синхронизация..." : "Сохранить таблицу в базу"}
        </button>
      </div>
    </div>
  );
}