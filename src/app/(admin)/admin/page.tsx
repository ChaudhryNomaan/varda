export default function AdminDashboard() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center animate-in fade-in duration-1000">
      <header className="space-y-4">
        <span className="text-[10px] uppercase tracking-[0.8em] text-gold/50 block">
          Control Panel
        </span>
        
        <h1 className="text-5xl md:text-6xl font-serif italic text-bone tracking-tighter">
          Welcome, Admin
        </h1>
        
        <div className="h-px w-12 bg-gold/30 mx-auto mt-8" />
        
        <p className="text-[11px] uppercase tracking-[0.4em] text-bone/40 max-w-xs mx-auto leading-relaxed pt-4">
          Select a section from the sidebar to manage your studio collections and interface.
        </p>
      </header>

      {/* Subtle background decorative element */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.02]">
        <h2 className="text-[20vw] font-serif italic select-none">AETHER</h2>
      </div>
    </div>
  );
}