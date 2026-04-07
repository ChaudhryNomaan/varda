"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '../../../../lib/supabase/client';
import { useCart } from '../../../../context/CartContext';

export default function ProductDetailsClient({ product }: { product: any }) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [activeAssetIndex, setActiveAssetIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const [showCheckout, setShowCheckout] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeAsset = product.images?.[activeAssetIndex];
  
  const isVideo = (url: string) => {
    if (!url) return false;
    return url.match(/\.(mp4|webm|ogg|mov|quicktime)/i);
  };

  // Calculate discount percentage for the UI
  const discountPercent = useMemo(() => {
    if (product.is_on_sale && product.old_price && product.price) {
      return Math.round(((product.old_price - product.price) / product.old_price) * 100);
    }
    return null;
  }, [product]);

  const handleBuyNow = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!selectedSize) {
      alert("Please select a dimension first.");
      return;
    }

    setIsRedirecting(true);

    try {
      const { error: saleError } = await supabase
        .from('orders')
        .insert([{
          customer_name: formData.name || "Web Customer",
          customer_email: formData.email || "pending@aether.store",
          total_amount: product.price, // Uses discounted price if on sale
          status: 'completed',
          payment_method: 'Direct Inquiry',
          items: [{
            id: product.id,
            name: product.name,
            size: selectedSize,
            price: product.price,
            category: product.category,
            customer_phone: formData.phone,
            delivery_address: formData.address
          }]
        }]);

      if (saleError) console.error("Ledger recording failed:", saleError);

      const { data: settings } = await supabase
        .from('admin_settings')
        .select('*')
        .eq('id', 1)
        .single();

      const activeMethod = settings?.active_notification_method || 'whatsapp';
      const recipient = settings?.notification_recipient || '79000000000';

      const productImage = product.images?.[0] || '';
      const messageText = 
        `✨ NEW ORDER INQUIRY ✨\n\n` +
        `Product: ${product.name}\n` +
        `Size: ${selectedSize}\n` +
        `Price: ${product.price?.toLocaleString()} ₽${product.is_on_sale ? ' (SALE)' : ''}\n` +
        `Customer: ${formData.name || 'Inquiry'}\n` +
        `Phone: ${formData.phone || 'Not provided'}\n` +
        `Address: ${formData.address || 'Not provided'}\n\n` +
        `Image Reference: ${productImage}`;

      const encodedMessage = encodeURIComponent(messageText);
      let url = "";

      if (activeMethod === 'whatsapp') {
        const cleanPhone = recipient.replace(/\D/g, '');
        url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMessage}`;
      } else if (activeMethod === 'telegram') {
        const cleanUser = recipient.replace('@', '');
        url = `https://t.me/${cleanUser}?text=${encodedMessage}`;
      } else if (activeMethod === 'vk') {
        url = `https://vk.me/${recipient}?message=${encodedMessage}`;
      }

      if (url) {
        window.location.href = url;
      }
      
      setShowCheckout(false);
    } catch (err) {
      console.error("Order process failed:", err);
    } finally {
      setIsRedirecting(false);
    }
  };

  if (!mounted) return <div className="bg-bone min-h-screen pt-40" />;

  return (
    <div className="bg-bone min-h-screen pt-40 pb-20 animate-in fade-in duration-700 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
          
          <div className="space-y-6">
            <div className="relative aspect-[3/4] bg-white/[0.03] overflow-hidden border border-taupe/10 shadow-2xl">
              {product.is_on_sale && (
                <div className="absolute top-6 left-6 z-10 bg-gold text-black text-[10px] font-bold px-4 py-1 tracking-[0.2em] shadow-lg">
                  SALE {discountPercent}%
                </div>
              )}
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
              
              <div className="flex flex-col">
                {product.is_on_sale && product.old_price && (
                  <span className="text-sm text-taupe/50 line-through decoration-gold/30 font-sans tracking-widest mb-1">
                    {product.old_price?.toLocaleString()} ₽
                  </span>
                )}
                <p className={`text-2xl font-serif italic ${product.is_on_sale ? 'text-gold' : 'text-espresso/80'}`}>
                  {product.price?.toLocaleString()} ₽
                </p>
              </div>
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

            <div className="pt-6">
              <button 
                onClick={() => selectedSize ? setShowCheckout(true) : alert("Please select a size first.")} 
                disabled={isRedirecting} 
                className="w-full md:w-96 bg-espresso text-bone py-6 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-gold hover:text-espresso transition-all shadow-xl active:scale-95 disabled:opacity-50"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {showCheckout && (
        <div className="fixed inset-0 z-[200] flex items-center justify-end">
          <div className="absolute inset-0 bg-espresso/40 backdrop-blur-sm" onClick={() => setShowCheckout(false)} />
          <div className="relative w-full max-w-lg h-full bg-bone p-10 shadow-2xl animate-in slide-in-from-right duration-500 overflow-y-auto">
            <button onClick={() => setShowCheckout(false)} className="absolute top-8 right-8 text-[10px] uppercase tracking-widest text-taupe hover:text-espresso">Close</button>
            
            <div className="mt-16">
              <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-bold">Order Placement</span>
              <h2 className="text-3xl font-serif italic text-espresso mt-2 mb-10">Shipping Details</h2>
              
              <form onSubmit={handleBuyNow} className="space-y-6">
                <div className="space-y-1 border-b border-taupe/20 pb-2">
                  <label className="text-[9px] uppercase tracking-widest text-taupe">Full Name</label>
                  <input required className="w-full bg-transparent outline-none text-espresso font-serif italic" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Full Name" />
                </div>
                
                <div className="space-y-1 border-b border-taupe/20 pb-2">
                  <label className="text-[9px] uppercase tracking-widest text-taupe">Email Address</label>
                  <input type="email" required className="w-full bg-transparent outline-none text-espresso text-sm" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="email@example.com" />
                </div>

                <div className="space-y-1 border-b border-taupe/20 pb-2">
                  <label className="text-[9px] uppercase tracking-widest text-taupe">Contact Phone</label>
                  <input type="tel" required className="w-full bg-transparent outline-none text-espresso text-sm" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+7 ..." />
                </div>

                <div className="space-y-1 border-b border-taupe/20 pb-2">
                  <label className="text-[9px] uppercase tracking-widest text-taupe">Delivery Address</label>
                  <textarea required rows={3} className="w-full bg-transparent outline-none text-espresso text-sm resize-none" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Street, City, Postcode" />
                </div>

                <div className="pt-8">
                  <button 
                    type="submit"
                    disabled={isRedirecting}
                    className="w-full bg-espresso text-bone py-6 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-gold hover:text-espresso transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isRedirecting ? "Syncing with Ledger..." : `Confirm Order — ${product.price?.toLocaleString()} ₽`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}