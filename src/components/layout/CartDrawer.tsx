"use client";
import React, { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';

// 1. Define the Interface to fix the TypeScript red underlines
interface CartItem {
  id: string;
  name?: string;
  price?: number;
  image?: string;
  images?: string[];
  selectedSize?: string;
  size?: string;
  quantity?: number;
}

export const CartDrawer = () => {
  // Extracting cart utilities from your Context
  const { isCartOpen, toggleCart, cartItems, removeFromCart } = useCart();
  const [mounted, setMounted] = useState(false);

  // 2. Handle Hydration (prevents Next.js errors between Server and Client)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isCartOpen || !mounted) return null;

  // 3. Cast cartItems to our interface and calculate subtotal safely
  const activeItems = (cartItems as CartItem[]) || [];
  
  const subtotal = activeItems.reduce(
    (acc: number, item: CartItem) => acc + ((item.price || 0) * (item.quantity || 1)), 
    0
  );

  return (
    <>
      {/* Dark Overlay with Backdrop Blur */}
      <div 
        className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm animate-in fade-in duration-500"
        onClick={toggleCart}
      />
      
      {/* Side Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-bone z-[70] shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 border-l border-taupe/10">
        
        {/* Header Section */}
        <div className="flex justify-between items-center border-b border-taupe/10 p-8 pb-6">
          <div className="space-y-1">
            <h2 className="text-xl font-serif italic text-espresso uppercase tracking-tight">Ваша Корзина</h2>
            <p className="text-[9px] uppercase tracking-[0.2em] text-gold">
              {activeItems.length} Предмета(ов)
            </p>
          </div>
          <button 
            onClick={toggleCart} 
            className="text-espresso hover:text-gold transition-all duration-300 p-2 border border-taupe/10 rounded-full hover:rotate-90"
            aria-label="Close cart"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Cart Items List */}
        <div className="flex-1 overflow-y-auto p-8 no-scrollbar bg-bone/50">
          {activeItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center space-y-6 text-center">
              <p className="text-[10px] uppercase tracking-[0.3em] text-taupe font-bold">Ваша корзина пуста</p>
              <button 
                onClick={toggleCart}
                className="text-[9px] uppercase tracking-[0.4em] border-b border-gold pb-1 text-espresso hover:text-gold transition-all"
              >
                Вернуться к покупкам
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {activeItems.map((item: CartItem, index: number) => (
                <div 
                  key={item.id ? `${item.id}-${index}` : index} 
                  className="flex gap-6 group animate-in fade-in slide-in-from-bottom-2 duration-500"
                >
                  {/* Luxury Product Preview */}
                  <div className="relative w-24 aspect-[3/4] bg-white border border-taupe/10 overflow-hidden flex-shrink-0 shadow-sm">
                    <img 
                      src={item.image || item.images?.[0] || '/placeholder.jpg'} 
                      alt={item.name || "Product"} 
                      className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" 
                    />
                  </div>

                  {/* Product Metadata */}
                  <div className="flex flex-col justify-between flex-1 py-1">
                    <div className="space-y-1">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="text-[11px] uppercase tracking-widest text-espresso font-bold leading-tight line-clamp-2">
                          {item.name || "Untitled Product"}
                        </h3>
                        <button 
                          onClick={() => removeFromCart(item.id)} 
                          className="text-[9px] text-taupe hover:text-red-800 uppercase tracking-tighter transition-colors flex-shrink-0"
                        >
                          Удалить
                        </button>
                      </div>
                      <p className="text-[10px] text-taupe/80 font-light italic capitalize">
                        Размер: {item.selectedSize || item.size || 'N/A'}
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-end border-t border-taupe/5 pt-3">
                       <span className="text-[10px] text-taupe uppercase tracking-widest">
                         Кол-во: {item.quantity || 1}
                       </span>
                       <span className="text-[13px] font-serif italic text-espresso">
                         {((item.price || 0) * (item.quantity || 1)).toLocaleString()} ₽
                       </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sticky Footer / Checkout Panel */}
        <div className="border-t border-taupe/20 p-8 space-y-6 bg-bone shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
          <div className="space-y-3">
             <div className="flex justify-between text-[10px] uppercase tracking-[0.3em] text-taupe">
               <span>Промежуточный итог</span>
               <span>{subtotal.toLocaleString()} ₽</span>
             </div>
             <div className="flex justify-between text-[11px] uppercase tracking-[0.4em] text-espresso font-bold border-t border-taupe/10 pt-4">
               <span>Итого к оплате</span>
               <span className="text-[14px]">{subtotal.toLocaleString()} ₽</span>
             </div>
          </div>
          
          <button 
            disabled={activeItems.length === 0}
            className="w-full py-6 text-[10px] bg-espresso text-bone uppercase tracking-[0.5em] hover:bg-gold hover:text-espresso transition-all duration-500 disabled:opacity-20 disabled:grayscale disabled:pointer-events-none shadow-xl active:scale-[0.98]"
          >
            Оформить заказ
          </button>
          
          <p className="text-[8px] text-center text-taupe/60 uppercase tracking-widest leading-relaxed px-4">
            Налоги и доставка рассчитываются при оформлении заказа.
          </p>
        </div>
      </div>
    </>
  );
};