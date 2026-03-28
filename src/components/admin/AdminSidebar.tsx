"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '../../lib/supabase/client'; // Adjust path if your client is elsewhere

const SECTIONS = [
  {
    title: 'Магазин',
    links: [
      { name: 'Товары', href: '/admin/products' },
      { name: 'Коллекции', href: '/admin/collections' },
    ]
  },
  {
    title: 'Интерфейс',
    links: [
      { name: 'Главный экран', href: '/admin/hero' },
      { name: 'Навигация', href: '/admin/settings/navbar' },
      { name: 'Подвал (Footer)', href: '/admin/settings/footer' },
    ]
  },
  {
    title: 'Уведомления',
    links: [
      { name: 'Настройка заказов', href: '/admin/products/contact' },
    ]
  },
  {
    title: 'Информация',
    links: [
      { name: 'Возврат и Обмен', href: '/admin/settings/returns' },
      { name: 'Доставка', href: '/admin/settings/shipping' },
      { name: 'Таблица размеров', href: '/admin/settings/size-guide' },
    ]
  }
];

export const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync closure on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isActive = (path: string) => pathname === path;

  // New Logout Logic
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  // IMPORTANT: Return a placeholder with the same dimensions during SSR 
  // to prevent the "removeChild" layout shift error.
  if (!isMounted) {
    return <aside className="hidden lg:flex w-64 bg-[#0A0A0A] h-screen border-r border-gold/10 p-8" />;
  }

  return (
    <>
      {/* MOBILE HEADER */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0A0A0A] border-b border-gold/10 px-6 flex items-center justify-between z-[110]">
        <h2 className="text-gold font-serif italic text-lg tracking-tighter">AETHER</h2>
        <button onClick={() => setIsOpen(!isOpen)} className="text-gold p-2 outline-none">
          {isOpen ? (
            <svg key="close-icon" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg key="menu-icon" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 8h16M4 16h16" /></svg>
          )}
        </button>
      </div>

      {/* BACKDROP - Wrapped in a check to prevent DOM mismatch */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[115] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR PANEL */}
      <aside 
        key="admin-sidebar-panel"
        className={`
          fixed inset-y-0 left-0 z-[120] w-72 bg-[#0A0A0A] border-r border-gold/10 p-8 flex flex-col
          transition-transform duration-500 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:w-64
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="mb-12 hidden lg:block">
          <h2 className="text-gold font-serif italic text-xl tracking-tighter">AETHER</h2>
          <span className="text-[9px] uppercase tracking-[0.4em] text-bone/40 block mt-1">Studio Control</span>
        </div>

        <nav className="flex-1 space-y-10 overflow-y-auto pr-2 custom-scrollbar mt-12 lg:mt-0">
          {SECTIONS.map((section) => (
            <div key={section.title} className="space-y-6">
              <span className="text-[8px] uppercase tracking-[0.5em] text-gold/30 font-bold block mb-4 border-b border-gold/5 pb-2">
                {section.title}
              </span>
              {section.links.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={`block text-[10px] uppercase tracking-[0.3em] transition-colors ${
                    isActive(link.href) ? 'text-gold' : 'text-bone/60 hover:text-gold'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* BOTTOM ACTION SECTION */}
        <div className="pt-8 space-y-6 border-t border-gold/10 mt-auto">
          <Link href="/" target="_blank" className="text-[9px] uppercase tracking-[0.2em] text-bone/30 hover:text-gold transition-colors flex items-center gap-2">
            <span className="font-sans">Просмотр сайта</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>

          {/* New Logout Button */}
          <button 
            onClick={handleLogout}
            className="text-[9px] uppercase tracking-[0.2em] text-red-900/40 hover:text-red-500 transition-all duration-500 text-left border-t border-white/5 pt-4 w-full"
          >
            Завершить сеанс
          </button>
        </div>
      </aside>
    </>
  );
};