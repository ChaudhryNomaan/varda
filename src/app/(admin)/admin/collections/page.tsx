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

  const trackChange = (id: string, field: string, value: string) => {
    setPendingChanges(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || collections.find(c => c.id === id)),
        [field]: value
      }
    }));
  };

  // ADVANCED SYNC WITH VERIFICATION
  const confirmAndSaveAll = async () => {
    const changeEntries = Object.entries(pendingChanges);
    if (changeEntries.length === 0) return;
    
    setIsSaving(true);
    try {
      for (const [id, payload] of changeEntries) {
        // 1. Strip system fields (id and created_at) to avoid Supabase rejection
        const { id: _id, created_at: _ca, ...cleanUpdate } = payload;

        // 2. Perform Update and request back the modified row for verification
        const { data, error } = await supabase
          .from('collections')
          .update(cleanUpdate)
          .eq('id', id)
          .select(); // This verifies the database actually changed

        if (error) throw error;

        // 3. Check if any row was actually modified
        if (!data || data.length === 0) {
          throw new Error(`Database rejected the update for ID: ${id}. This is usually an RLS policy issue.`);
        }
      }

      // 4. Update local state only after DB confirmation
      setCollections(prev => prev.map(col => {
        if (pendingChanges[col.id]) {
          return { ...col, ...pendingChanges[col.id] };
        }
        return col;
      }));

      setPendingChanges({});
      alert("AETHER Archive synchronized successfully.");
    } catch (err: any) {
      console.error("Supabase Sync Error:", err);
      alert(`Sync Failed: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const addNewCollection = async () => {
    const { data, error } = await supabase
      .from('collections')
      .insert([{ title: 'New Collection', subtitle: 'Sub-text', href: '/collections/new', image: '' }])
      .select();

    if (!error && data) {
      setCollections([data[0], ...collections]);
    }
  };

  const deleteCollection = async (id: string) => {
    if (!confirm("Are you sure? This action is permanent.")) return;
    const { error } = await supabase.from('collections').delete().eq('id', id);
    if (!error) {
      setCollections(collections.filter(c => c.id !== id));
      const newPending = { ...pendingChanges };
      delete newPending[id];
      setPendingChanges(newPending);
    }
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${id}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('products').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('products').getPublicUrl(fileName);
      trackChange(id, 'image', urlData.publicUrl);
    } catch (err: any) {
      alert("Upload error: " + err.message);
    } finally {
      setUploading(false);
      setEditingId(null);
    }
  };

  const isVideo = (url: string) => url && /\.(mp4|webm|ogg|mov)$/i.test(url);
  const hasUnsavedChanges = Object.keys(pendingChanges).length > 0;

  if (loading) return (
    <div className="p-10 bg-[#0A0A0A] min-h-screen flex items-center justify-center font-serif">
      <span className="text-[10px] uppercase tracking-[0.8em] text-gold animate-pulse font-sans">AETHER ARCHIVE LOADING...</span>
    </div>
  );

  return (
    <div className="max-w-7xl p-6 md:p-10 bg-[#0A0A0A] min-h-screen text-bone pb-40">
      <div className="mb-12 flex justify-between items-end">
        <div>
          <span className="text-[10px] uppercase tracking-[0.5em] text-gold/60 font-bold font-sans">Editorial Control</span>
          <h1 className="text-4xl font-serif italic mt-2 text-gold">Коллекции</h1>
        </div>
        
        <button onClick={addNewCollection} className="px-6 py-2 border border-gold/40 text-[10px] uppercase tracking-widest text-gold hover:bg-gold hover:text-black transition-all duration-500 font-sans">
          + Add New Collection
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {collections.map((col) => {
          const displayData = pendingChanges[col.id] || col;
          const isModified = !!pendingChanges[col.id];

          return (
            <div key={col.id} className={`border ${isModified ? 'border-gold shadow-[0_0_15px_rgba(212,175,55,0.1)]' : 'border-gold/10'} bg-white/5 group relative transition-all duration-500`}>
              <button onClick={() => deleteCollection(col.id)} className="absolute top-2 right-2 z-10 bg-black/80 p-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <div className="aspect-[3/4] bg-espresso relative overflow-hidden">
                {isVideo(displayData.image) ? (
                  <video key={displayData.image} src={displayData.image} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-700" />
                ) : (
                  <img key={displayData.image} src={displayData.image || 'https://via.placeholder.com/600x800?text=No+Media'} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-700" alt="" />
                )}
                <div onClick={() => { setEditingId(col.id); fileInputRef.current?.click(); }} className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                   <div className="border border-gold/40 px-5 py-2">
                    <span className="text-[9px] uppercase tracking-widest text-gold font-bold font-sans">Change Media</span>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="text-[8px] uppercase tracking-widest text-gold/40 block mb-2 font-sans">Title</label>
                  <input 
                      value={displayData.title} 
                      onChange={(e) => trackChange(col.id, 'title', e.target.value)} 
                      className="bg-transparent border-b border-gold/10 w-full text-xl font-serif italic text-gold py-1 focus:border-gold outline-none transition-colors" 
                  />
                </div>
                <div>
                  <label className="text-[8px] uppercase tracking-widest text-gold/40 block mb-2 font-sans">Subtitle</label>
                  <input 
                      value={displayData.subtitle} 
                      onChange={(e) => trackChange(col.id, 'subtitle', e.target.value)} 
                      className="bg-transparent border-b border-gold/10 w-full text-[10px] uppercase tracking-[0.3em] text-bone/60 py-1 focus:border-gold outline-none transition-colors font-sans" 
                  />
                </div>
                <div>
                  <label className="text-[8px] uppercase tracking-widest text-gold/40 block mb-2 font-sans">Href Path</label>
                  <input 
                      value={displayData.href} 
                      onChange={(e) => trackChange(col.id, 'href', e.target.value)} 
                      className="bg-transparent border-b border-gold/10 w-full text-[11px] font-mono text-bone/40 py-1 focus:border-gold outline-none transition-colors" 
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FLOATING ACTION BAR */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-0 left-0 right-0 bg-gold p-6 flex justify-between items-center z-[100] shadow-[0_-10px_40px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-full duration-500">
          <div className="flex flex-col font-sans">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-black rounded-full animate-pulse" />
              <span className="text-black text-[10px] font-bold uppercase tracking-[0.3em]">Pending Synchronization</span>
            </div>
            <span className="text-black/60 text-[9px] uppercase tracking-tighter italic">Archive contains {Object.keys(pendingChanges).length} unsaved updates</span>
          </div>
          <div className="flex gap-6 font-sans">
            <button 
              onClick={() => fetchCollections()} 
              disabled={isSaving}
              className="text-[10px] uppercase tracking-widest text-black/40 hover:text-black transition-colors disabled:opacity-30"
            >
              Discard Changes
            </button>
            <button 
                onClick={confirmAndSaveAll} 
                disabled={isSaving}
                className="bg-black text-gold px-12 py-3 text-[10px] uppercase tracking-[0.2em] font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-2xl disabled:opacity-50"
            >
                {isSaving ? 'Syncing AETHER...' : 'Confirm & Sync Archive'}
            </button>
          </div>
        </div>
      )}

      <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={(e) => editingId && handleMediaUpload(e, editingId)} />

      {uploading && (
        <div className="fixed bottom-10 right-10 bg-black border border-gold text-gold px-8 py-4 text-[10px] font-bold uppercase tracking-widest animate-pulse z-[110] font-sans">
          Processing Media...
        </div>
      )}
    </div>
  );
}