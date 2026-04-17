"use client";
import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '../../../../lib/supabase/client';

export default function AdminCollections() {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [collections, setCollections] = useState<any[]>([]);
  const [pendingChanges, setPendingChanges] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchCollections();
  }, []);

  async function fetchCollections() {
    const { data } = await supabase
      .from('collections')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) {
      setCollections(data);
      setPendingChanges({}); 
    }
    setLoading(false);
  }

  const trackChange = (id: string, field: string, value: any) => {
    setPendingChanges(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || collections.find(c => c.id === id)),
        [field]: value
      }
    }));
  };

  const confirmAndSaveAll = async () => {
    const changeEntries = Object.entries(pendingChanges);
    if (changeEntries.length === 0) return;
    
    setIsSaving(true);
    try {
      for (const [id, payload] of changeEntries) {
        const { id: _id, created_at: _ca, ...cleanUpdate } = payload;

        const { error } = await supabase
          .from('collections')
          .update(cleanUpdate)
          .eq('id', id);

        if (error) throw error;
      }

      setCollections(prev => prev.map(col => {
        if (pendingChanges[col.id]) {
          return { ...col, ...pendingChanges[col.id] };
        }
        return col;
      }));

      setPendingChanges({});
      alert("Editorial Archive successfully synchronized.");
    } catch (err: any) {
      console.error("Sync Error:", err);
      alert(`Synchronization Failed: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const addNewCollection = async () => {
    const { data, error } = await supabase
      .from('collections')
      .insert([{ 
        title: 'New Archive Entry', 
        href: '/collections/tshirts', 
        is_on_sale: false, 
        image: '' 
      }])
      .select();

    if (!error && data) {
      setCollections([data[0], ...collections]);
    }
  };

  const deleteCollection = async (id: string) => {
    if (!confirm("Permanently remove this collection from the editorial showcase?")) return;
    const { error } = await supabase.from('collections').delete().eq('id', id);
    if (!error) {
      setCollections(collections.filter(c => c.id !== id));
    }
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `showcase-${id}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('products').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('products').getPublicUrl(fileName);
      trackChange(id, 'image', urlData.publicUrl);
    } catch (err: any) {
      alert("Media upload failed: " + err.message);
    } finally {
      setUploading(false);
      setEditingId(null);
    }
  };

  const isVideo = (url: string) => url && /\.(mp4|webm|ogg|mov)$/i.test(url);
  const hasUnsavedChanges = Object.keys(pendingChanges).length > 0;

  if (loading) return (
    <div className="p-10 bg-[#0A0A0A] min-h-screen flex items-center justify-center">
      <span className="text-[10px] uppercase tracking-[0.8em] text-gold animate-pulse">Initializing Editorial Vault...</span>
    </div>
  );

  return (
    <div className="max-w-7xl p-6 md:p-10 bg-[#0A0A0A] min-h-screen text-bone pb-40 mx-auto">
      <div className="mb-12 flex justify-between items-end">
        <div>
          <span className="text-[10px] uppercase tracking-[0.5em] text-gold/60 font-bold">vardated Content</span>
          <h1 className="text-4xl font-serif italic mt-2 text-gold">Showcase Management</h1>
        </div>
        
        <button onClick={addNewCollection} className="px-6 py-2 border border-gold/40 text-[10px] uppercase tracking-widest text-gold hover:bg-gold hover:text-black transition-all">
          + New Collection Card
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {collections.map((col) => {
          const displayData = pendingChanges[col.id] || col;
          const isModified = !!pendingChanges[col.id];

          return (
            <div key={col.id} className={`border ${isModified ? 'border-gold' : 'border-gold/10'} bg-white/5 group relative transition-all`}>
              <button onClick={() => deleteCollection(col.id)} className="absolute top-2 right-2 z-10 bg-black/80 p-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <div className="aspect-[3/4] bg-neutral-900 relative overflow-hidden">
                {displayData.image ? (
                  isVideo(displayData.image) ? (
                    <video src={displayData.image} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-70" />
                  ) : (
                    <img src={displayData.image} className="w-full h-full object-cover opacity-70" alt="" />
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-gold/20 uppercase tracking-widest">Asset Missing</div>
                )}
                
                <div onClick={() => { setEditingId(col.id); fileInputRef.current?.click(); }} className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                  <span className="text-[9px] uppercase tracking-widest text-gold border border-gold/40 px-4 py-2">Update Asset</span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-[8px] uppercase tracking-widest text-gold/40">Archive Title</label>
                  <input 
                    value={displayData.title} 
                    onChange={(e) => trackChange(col.id, 'title', e.target.value)} 
                    className="bg-transparent border-b border-gold/10 w-full text-lg font-serif italic text-gold py-1 outline-none focus:border-gold" 
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[8px] uppercase tracking-widest text-gold/40">Navigation Route (Slug)</label>
                  <input 
                    value={displayData.href} 
                    onChange={(e) => trackChange(col.id, 'href', e.target.value)} 
                    placeholder="/collections/tshirts"
                    className="bg-transparent border-b border-gold/10 w-full text-[11px] font-mono text-bone/60 py-1 outline-none focus:border-gold" 
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[9px] uppercase tracking-widest text-bone/40">Sale Status</span>
                  <button 
                    onClick={() => trackChange(col.id, 'is_on_sale', !displayData.is_on_sale)}
                    className={`text-[9px] uppercase tracking-widest px-3 py-1 border transition-all ${displayData.is_on_sale ? 'bg-gold text-black border-gold' : 'border-gold/20 text-gold/40'}`}
                  >
                    {displayData.is_on_sale ? 'Active Sale' : 'Standard'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {hasUnsavedChanges && (
        <div className="fixed bottom-0 left-0 right-0 bg-gold p-6 flex justify-between items-center z-[100] shadow-2xl">
          <div className="flex flex-col">
            <span className="text-black text-[10px] font-bold uppercase tracking-widest">Pending Editorial Updates</span>
            <span className="text-black/60 text-[9px] uppercase italic">{Object.keys(pendingChanges).length} entries modified</span>
          </div>
          <div className="flex gap-6">
            <button onClick={() => fetchCollections()} disabled={isSaving} className="text-[10px] uppercase tracking-widest text-black/40 hover:text-black">
              Discard Changes
            </button>
            <button onClick={confirmAndSaveAll} disabled={isSaving} className="bg-black text-gold px-10 py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-neutral-800 transition-all">
                {isSaving ? 'Synchronizing...' : 'Publish Changes'}
            </button>
          </div>
        </div>
      )}

      <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={(e) => editingId && handleMediaUpload(e, editingId)} />

      {uploading && (
        <div className="fixed bottom-10 right-10 bg-black border border-gold text-gold px-8 py-4 text-[10px] font-bold uppercase tracking-widest animate-pulse z-[110]">
          Processing Media Asset...
        </div>
      )}
    </div>
  );
}