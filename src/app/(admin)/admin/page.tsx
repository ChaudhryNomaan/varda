export default function AdminDashboard() {
  const stats = [
    { label: "Продажи (Месяц)", value: "542,000 ₽", trend: "+15%" },
    { label: "Новые Заказы", value: "8", trend: "0" },
    { label: "Посетители", value: "2,401", trend: "+8%" },
  ];

  return (
    <div className="space-y-12">
      <header>
        <span className="text-[10px] uppercase tracking-[0.5em] text-gold/60">Аналитика</span>
        <h1 className="text-4xl font-serif italic text-bone mt-2">Панель Управления</h1>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white/5 border border-gold/10 p-8 backdrop-blur-sm">
            <p className="text-[9px] uppercase tracking-[0.3em] text-bone/40 mb-4">{stat.label}</p>
            <div className="flex justify-between items-end">
              <span className="text-3xl font-light tracking-tight">{stat.value}</span>
              <span className="text-[10px] text-gold italic">{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Inventory & Recent Activity Section */}
      <div className="bg-white/5 border border-gold/5 p-8">
        <h3 className="text-[11px] uppercase tracking-[0.4em] mb-8 border-b border-gold/10 pb-4">
          Последняя активность
        </h3>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex justify-between items-center text-[11px] uppercase tracking-widest text-bone/60 py-2 border-b border-gold/5">
              <span>Заказ #V-200{item} — Silk Set</span>
              <span className="px-3 py-1 bg-gold/10 text-gold text-[9px]">Оплачено</span>
              <span>18,900 ₽</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}