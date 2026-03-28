"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '../../../../../lib/supabase/client';

export default function AdminSettings() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    active_method: 'whatsapp',
    recipient_id: '',
  });

  useEffect(() => {
    async function fetchSettings() {
      // Fetch row ID 1 explicitly
      const { data } = await supabase
        .from('admin_settings')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (data) {
        setSettings({
          active_method: data.active_notification_method,
          recipient_id: data.notification_recipient,
        });
      }
      setLoading(false);
    }
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    
    // UPSERT: Update existing row or create new row at ID 1
    const { error } = await supabase
      .from('admin_settings')
      .upsert({
        id: 1, 
        active_notification_method: settings.active_method,
        notification_recipient: settings.recipient_id,
      }, { onConflict: 'id' });

    setSaving(false);
    if (error) {
      console.error(error);
      alert("Error updating protocol: " + error.message);
    } else {
      alert("Redirect Protocol Updated Successfully.");
    }
  };

  if (loading) return <div className="p-20 text-espresso font-serif italic">Loading Configuration...</div>;

  return (
    <div className="bg-bone min-h-screen p-10 md:p-20 font-sans">
      <div className="max-w-2xl mx-auto space-y-12">
        <header className="space-y-2">
          <h1 className="text-4xl font-serif italic text-espresso">Buy Now Redirect</h1>
          <p className="text-[10px] uppercase tracking-widest text-gold font-bold">Customer Contact Protocol</p>
        </header>

        <div className="space-y-8 bg-white/50 p-8 border border-taupe/10 shadow-xl">
          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-widest text-espresso font-bold">Redirect Platform</label>
            <div className="grid grid-cols-3 gap-4">
              {['whatsapp', 'telegram', 'vk'].map((method) => (
                <button
                  key={method}
                  onClick={() => setSettings({ ...settings, active_method: method })}
                  className={`py-4 text-[10px] uppercase tracking-widest border transition-all ${
                    settings.active_method === method 
                    ? "bg-espresso text-bone border-espresso" 
                    : "border-taupe/20 text-taupe hover:border-gold"
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-espresso font-bold">
              {settings.active_method === 'whatsapp' ? 'Phone Number (e.g. 79001234567)' : 'Username / ID'}
            </label>
            <input
              type="text"
              value={settings.recipient_id}
              onChange={(e) => setSettings({ ...settings, recipient_id: e.target.value })}
              className="w-full bg-transparent border-b border-taupe/30 py-2 focus:border-gold outline-none text-espresso"
              placeholder={settings.active_method === 'whatsapp' ? "79001234567" : "username"}
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-espresso text-bone py-4 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-gold hover:text-espresso transition-all disabled:opacity-50"
          >
            {saving ? "Updating..." : "Save Preferences"}
          </button>
        </div>
      </div>
    </div>
  );
}