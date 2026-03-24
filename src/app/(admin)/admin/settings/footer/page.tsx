"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '../../../../../lib/supabase/client';

export default function FooterSettingsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [settings, setSettings] = useState({
    brandName: "AETHER",
    brandDescription: "A digital atelier dedicated to the preservation of high-end archival fashion and bespoke craftsmanship.",
    adminNotificationEmail: "",
    column1Heading: "Collections",
    column2Heading: "Archive",
    newsletterHeading: "The Gazette",
    newsletterText: "Join our inner circle for early access to new archival drops.",
    instagramUrl: "",
    telegramUrl: "",
    copyrightText: "© 2026 AETHER ATELIER. All Rights Reserved."
  });

  useEffect(() => {
    async function loadSettings() {
      const { data } = await supabase
        .from('site_config')
        .select('content')
        .eq('key', 'footer')
        .single();

      if (data) setSettings(data.content);
      setLoading(false);
    }
    loadSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from('site_config')
      .upsert({ 
        key: 'footer', 
        content: settings,
        updated_at: new Date().toISOString() 
      }, { onConflict: 'key' });

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("AETHER Footer successfully synchronized.");
    }
    setSaving(false);
  };

  if (loading) return <div className="p-20 text-gold animate-pulse uppercase text-[10px] tracking-widest">Initialising Configuration...</div>;

  return (
    <div className="max-w-6xl animate-in fade-in duration-700">
      <div className="mb-12 border-b border-gold/10 pb-8">
        <span className="text-[10px] uppercase tracking-[0.5em] text-gold/60">System Configuration</span>
        <h1 className="text-4xl font-serif italic text-bone mt-2">Footer & Global Identity</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* BRAND IDENTITY */}
          <div className="lg:col-span-2 bg-white/5 p-10 border border-gold/10 space-y-8">
            <h2 className="text-[10px] uppercase tracking-[0.4em] text-gold pb-4 border-b border-gold/5">Atelier Identity</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col space-y-3">
                <label className="text-[9px] uppercase tracking-widest text-gold/60 font-medium">Studio Designation</label>
                <input 
                  name="brandName"
                  value={settings.brandName}
                  onChange={handleChange}
                  className="bg-charcoal border border-gold/20 p-4 text-bone text-xs focus:outline-none focus:border-gold transition-all"
                />
              </div>

              <div className="flex flex-col space-y-3">
                <label className="text-[9px] uppercase tracking-widest text-gold/60 font-medium">Notification Concierge (Email)</label>
                <input 
                  name="adminNotificationEmail"
                  type="email"
                  value={settings.adminNotificationEmail}
                  onChange={handleChange}
                  placeholder="admin@aether.atelier"
                  className="bg-charcoal border border-gold/20 p-4 text-bone text-xs focus:outline-none focus:border-gold transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <label className="text-[9px] uppercase tracking-widest text-gold/60 font-medium">Manifesto / Description</label>
              <textarea 
                name="brandDescription"
                value={settings.brandDescription}
                onChange={handleChange}
                rows={4}
                className="bg-charcoal border border-gold/20 p-4 text-bone text-[11px] leading-relaxed focus:outline-none focus:border-gold resize-none font-light italic"
              />
            </div>
          </div>

          {/* SOCIAL LINKS */}
          <div className="bg-white/5 p-10 border border-gold/10 space-y-8">
            <h2 className="text-[10px] uppercase tracking-[0.4em] text-gold pb-4 border-b border-gold/5">Social Channels</h2>
            <div className="space-y-6">
              <div className="flex flex-col space-y-3">
                <label className="text-[9px] uppercase tracking-widest text-gold/60">Instagram Handle</label>
                <input name="instagramUrl" value={settings.instagramUrl} onChange={handleChange} placeholder="@aether" className="bg-charcoal border border-gold/20 p-4 text-bone text-[10px] focus:outline-none" />
              </div>
              <div className="flex flex-col space-y-3">
                <label className="text-[9px] uppercase tracking-widest text-gold/60">Telegram Portal</label>
                <input name="telegramUrl" value={settings.telegramUrl} onChange={handleChange} placeholder="t.me/aether" className="bg-charcoal border border-gold/20 p-4 text-bone text-[10px] focus:outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* STRUCTURE & HEADINGS */}
        <div className="bg-white/5 p-10 border border-gold/10">
          <h2 className="text-[10px] uppercase tracking-[0.4em] text-gold pb-6 border-b border-gold/5 mb-8">Navigation Architecture</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { label: "Column I", name: "column1Heading" },
              { label: "Column II", name: "column2Heading" },
              { label: "Newsletter Label", name: "newsletterHeading" },
              { label: "Legal/Copyright", name: "copyrightText" }
            ].map((field) => (
              <div key={field.name} className="flex flex-col space-y-3">
                <label className="text-[9px] uppercase tracking-widest text-gold/60">{field.label}</label>
                <input 
                  name={field.name} 
                  value={(settings as any)[field.name]} 
                  onChange={handleChange} 
                  className="bg-charcoal border border-gold/20 p-4 text-bone text-xs focus:outline-none focus:border-gold transition-all" 
                />
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8">
          <button 
            type="submit"
            disabled={saving}
            className="w-full bg-gold text-charcoal py-6 text-[11px] font-bold uppercase tracking-[0.6em] hover:bg-white transition-all shadow-2xl disabled:opacity-50 hover:-translate-y-1"
          >
            {saving ? "Synchronizing Archive..." : "Push Global Updates"}
          </button>
        </div>
      </form>
    </div>
  );
}