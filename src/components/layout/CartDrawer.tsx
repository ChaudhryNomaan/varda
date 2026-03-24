"use client";
import { useCart } from '../../context/CartContext';

export const CartDrawer = () => {
  const { isCartOpen, toggleCart, cartCount } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Dark Overlay */}
      <div 
        className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
        onClick={toggleCart}
      />
      
      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-bone z-[70] shadow-2xl p-8 flex flex-col">
        <div className="flex justify-between items-center border-b border-taupe/20 pb-6">
          <h2 className="text-xl font-serif italic text-espresso uppercase tracking-tight">Ваша Корзина</h2>
          <button onClick={toggleCart} className="text-espresso hover:text-gold transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          {cartCount === 0 ? (
            <>
              <p className="text-[10px] uppercase tracking-[0.3em] text-taupe">Ваша корзина пуста</p>
              <button 
                onClick={toggleCart}
                className="text-[9px] uppercase tracking-[0.4em] border-b border-gold pb-1 text-espresso"
              >
                Вернуться к покупкам
              </button>
            </>
          ) : (
            <p className="text-espresso">В корзине: {cartCount} предметов</p>
          )}
        </div>

        <div className="border-t border-taupe/20 pt-8 space-y-4">
          <div className="flex justify-between text-[10px] uppercase tracking-[0.3em] text-espresso">
            <span>Итого</span>
            <span>0 ₽</span>
          </div>
          <button className="btn-primary w-full py-5 text-[10px] bg-espresso text-bone uppercase tracking-[0.5em] hover:bg-gold transition-all duration-500">
            Оформить заказ
          </button>
        </div>
      </div>
    </>
  );
};