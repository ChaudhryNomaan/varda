import { AdminSidebar } from '../../../components/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#0A0A0A] text-bone selection:bg-gold/30 selection:text-gold font-sans antialiased">
      {/* 1. Sticky Sidebar */}
      <AdminSidebar />
      
      {/* 2. Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto relative custom-scrollbar scroll-smooth">
        
        {/* 3. Sticky Utility Header */}
        <div className="sticky top-0 z-50 flex justify-between items-center px-12 py-6 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-gold/50 animate-ping" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.5em] text-white/60 font-bold">cura Studio</span>
              <span className="text-[7px] uppercase tracking-[0.3em] text-gold/40 -mt-0.5">Control Interface v2.1</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <a 
              href="/" 
              target="_blank" 
              className="group flex items-center gap-2 text-[9px] uppercase tracking-widest text-gold hover:text-white transition-all border border-gold/10 px-5 py-2.5 hover:bg-gold/5"
            >
              Live Site <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">↗</span>
            </a>
          </div>
        </div>

        {/* 4. Dynamic Page Content */}
        <div className="p-12 pb-32">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
            {children}
          </div>
        </div>

        {/* 5. Watermark Identity - Updated to cura */}
        <div className="fixed bottom-12 right-12 pointer-events-none opacity-[0.03] select-none z-0">
          <h2 className="text-[14vw] font-serif italic leading-none tracking-tighter">cura</h2>
        </div>
      </main>
    </div>
  );
}