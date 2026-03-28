"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '../../../../lib/supabase/client';

export default function ProductDetailsClient({ product }: { product: any }) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [activeAssetIndex, setActiveAssetIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeAsset = product.images?.[activeAssetIndex];
  
  const isVideo = (url: string) => {
    if (!url) return false;
    return url.match(/\.(mp4|webm|ogg|mov|quicktime)/i);
  };

  const handleBuyNow = async () => {
    if (!selectedSize) {
      alert("Please select a dimension first.");
      return;
    }

    setIsRedirecting(true);

    try {
      // Fetch specifically row ID 1 to match Admin settings
      const { data: settings } = await supabase
        .from('admin_settings')
        .select('*')
        .eq('id', 1)
        .single();

      // FALLBACK DEFAULTS
      const activeMethod = settings?.active_notification_method || 'whatsapp';
      const recipient = settings?.notification_recipient || '79000000000';

      const messageText = 
        `Hello Aether! I would like to purchase:\n\n` +
        `Product: ${product.name}\n` +
        `Size: ${selectedSize}\n` +
        `Price: ${product.price?.toLocaleString()} ₽`;

      const encodedMessage = encodeURIComponent(messageText);
      let url = "";

      if (activeMethod === 'whatsapp') {
        // Remove all non-digits for WhatsApp compatibility
        const cleanPhone = recipient.replace(/\D/g, '');
        url = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
      } else if (activeMethod === 'telegram') {
        url = `https://t.me/${recipient.replace('@', '')}`;
      } else if (activeMethod === 'vk') {
        url = `https://vk.me/${recipient}`;
      }

      if (url) window.open(url, '_blank');
    } catch (err) {
      console.error("Order redirection failed:", err);
    } finally {
      setIsRedirecting(false);
    }
  };

  if (!mounted) return <div className="bg-bone min-h-screen pt-40" />;

  return (
    <div className="bg-bone min-h-screen pt-40 pb-20 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
          
          <div className="space-y-6">
            <div className="relative aspect-[3/4] bg-white/[0.03] overflow-hidden border border-taupe/10 shadow-2xl">
              {isVideo(activeAsset) ? (
                <video key={`v-${activeAssetIndex}`} src={activeAsset} className="w-full h-full object-cover" autoPlay muted loop playsInline />
              ) : (
                <img key={`i-${activeAssetIndex}`} src={activeAsset || '/placeholder.jpg'} className="w-full h-full object-cover" alt={product.name} />
              )}
            </div>

            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                {product.images.map((asset: string, index: number) => (
                  <button key={`t-${index}`} onClick={() => setActiveAssetIndex(index)} className={`relative flex-shrink-0 w-20 aspect-[3/4] border transition-all ${activeAssetIndex === index ? "border-gold scale-95" : "border-taupe/10 opacity-40 hover:opacity-100"}`}>
                    {isVideo(asset) ? <div className="w-full h-full bg-espresso flex items-center justify-center"><div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-bone border-b-[4px] border-b-transparent" /></div> : <img src={asset} className="w-full h-full object-cover" alt="" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center space-y-12">
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.5em] text-gold font-sans font-bold">{product.category} Collection</span>
              <h1 className="text-5xl md:text-6xl font-serif italic text-espresso tracking-tight">{product.name}</h1>
              <p className="text-2xl text-espresso/80 font-serif italic">{product.price?.toLocaleString()} ₽</p>
            </div>

            <p className="text-[14px] leading-relaxed text-taupe/90 max-w-md font-light">{product.description}</p>

            <div className="space-y-6">
              <span className="text-[10px] uppercase tracking-[0.3em] text-espresso font-bold">Select Dimension</span>
              <div className="flex flex-wrap gap-3">
                {product.sizes?.map((size: string) => (
                  <button key={size} onClick={() => setSelectedSize(size)} className={`px-8 py-3 text-[10px] uppercase border tracking-widest transition-all ${selectedSize === size ? "bg-espresso text-bone border-espresso shadow-lg scale-105" : "border-taupe/20 text-taupe hover:border-gold"}`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 space-y-4">
              <button className="w-full md:w-96 bg-espresso text-bone py-6 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-gold hover:text-espresso transition-all shadow-xl active:scale-95">
                Add to Atelier Bag
              </button>
              
              <button onClick={handleBuyNow} disabled={isRedirecting} className="w-full md:w-96 bg-transparent border border-espresso text-espresso py-6 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-espresso hover:text-bone transition-all active:scale-95 disabled:opacity-50">
                {isRedirecting ? "Processing..." : "Buy Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}