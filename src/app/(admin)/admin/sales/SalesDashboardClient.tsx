"use client";
import React, { useState, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';

type TimeFrame = '7d' | '30d' | '1y' | 'all';

export default function SalesDashboardClient({ initialOrders }: { initialOrders: any[] }) {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('30d');

  const filteredOrders = useMemo(() => {
    const now = new Date();
    return initialOrders.filter(order => {
      const orderDate = new Date(order.created_at);
      if (timeFrame === '7d') return now.getTime() - orderDate.getTime() <= 7 * 24 * 60 * 60 * 1000;
      if (timeFrame === '30d') return now.getTime() - orderDate.getTime() <= 30 * 24 * 60 * 60 * 1000;
      if (timeFrame === '1y') return now.getTime() - orderDate.getTime() <= 365 * 24 * 60 * 60 * 1000;
      return true;
    });
  }, [timeFrame, initialOrders]);

  const revenueData = useMemo(() => {
    const groups = filteredOrders.reduce((acc: any, order: any) => {
      const date = new Date(order.created_at).toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' });
      acc[date] = (acc[date] || 0) + Number(order.total_amount);
      return acc;
    }, {});
    return Object.entries(groups).map(([name, total]) => ({ name, total })).reverse();
  }, [filteredOrders]);

  const productData = useMemo(() => {
    const productCounts: any = {};
    filteredOrders.forEach(order => {
      order.items.forEach((item: any) => {
        productCounts[item.name] = (productCounts[item.name] || 0) + 1;
      });
    });
    return Object.entries(productCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 5);
  }, [filteredOrders]);

  const totalRevenue = filteredOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);

  return (
    <div className="p-4 md:p-8 bg-bone min-h-screen font-sans animate-in fade-in duration-700">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 md:mb-12 gap-6 border-b border-taupe/10 pb-8">
        <div className="max-w-full">
          <span className="text-[10px] uppercase tracking-[0.5em] text-taupe font-bold block">AETHER Intelligence</span>
          <h1 className="text-3xl md:text-5xl font-serif italic text-espresso mt-2 break-words">Sales Analytics</h1>
        </div>

        {/* Responsive Filter Container: Scrollable on Mobile */}
        <div className="w-full lg:w-auto overflow-x-auto no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
          <div className="flex bg-white border border-taupe/10 p-1 rounded-sm shadow-sm min-w-max">
            {(['7d', '30d', '1y', 'all'] as TimeFrame[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeFrame(tf)}
                className={`px-4 md:px-6 py-2 text-[9px] uppercase tracking-widest transition-all ${
                  timeFrame === tf ? 'bg-espresso text-bone' : 'text-taupe hover:text-espresso'
                }`}
              >
                {tf === '7d' ? 'Week' : tf === '30d' ? 'Month' : tf === '1y' ? 'Year' : 'All'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
        {/* REVENUE AREA */}
        <div className="bg-white border border-taupe/10 p-4 md:p-8 h-[300px] md:h-[350px] shadow-sm">
          <p className="text-[10px] uppercase tracking-widest text-taupe mb-6 font-bold">Revenue Timeline (₽)</p>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C5A059" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#C5A059" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F1F1" />
              <XAxis dataKey="name" fontSize={9} tickLine={false} axisLine={false} />
              <YAxis fontSize={9} width={35} tickLine={false} axisLine={false} tickFormatter={(v) => `${v/1000}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1A1A1A', border: 'none', borderRadius: '0' }}
                itemStyle={{ color: '#C5A059', fontSize: '11px' }}
                labelStyle={{ color: '#F1F1F1', fontSize: '9px' }}
              />
              <Area type="monotone" dataKey="total" stroke="#C5A059" fill="url(#colorRev)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* TOP PRODUCTS BAR */}
        <div className="bg-white border border-taupe/10 p-4 md:p-8 h-[300px] md:h-[350px] shadow-sm">
          <p className="text-[10px] uppercase tracking-widest text-taupe mb-6 font-bold">Top Performing Pieces</p>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={productData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F1F1" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" fontSize={9} width={60} tickLine={false} axisLine={false} />
              <Tooltip cursor={{fill: '#F9F8F6'}} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={15}>
                {productData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#C5A059' : '#1A1A1A'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TRANSACTION MANIFEST */}
      <div className="bg-white border border-taupe/10 shadow-sm overflow-hidden">
        <div className="p-4 md:p-6 border-b border-taupe/10 flex flex-col sm:row justify-between items-start sm:items-center gap-2">
          <h2 className="text-xs uppercase tracking-[0.3em] text-espresso font-bold">Transaction Manifest</h2>
          <span className="text-[10px] text-taupe italic">{totalRevenue.toLocaleString()} ₽ Total for period</span>
        </div>
        
        {/* Table Scroll Wrapper */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="bg-espresso text-bone text-[9px] uppercase tracking-[0.3em]">
                <th className="p-4 md:p-5 font-light">Timestamp</th>
                <th className="p-4 md:p-5 font-light">Product Detail</th>
                <th className="p-4 md:p-5 font-light text-right">Settlement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-taupe/5">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-bone/30 transition-all">
                  <td className="p-4 md:p-5 whitespace-nowrap align-top">
                    <div className="text-espresso font-medium text-xs">
                      {new Date(order.created_at).toLocaleDateString('ru-RU')}
                    </div>
                    <div className="text-[9px] text-taupe uppercase mt-1">
                      {new Date(order.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="p-4 md:p-5">
                    <div className="space-y-3">
                      {order.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex flex-col border-l-2 border-gold/20 pl-3 py-0.5">
                          <span className="text-espresso font-serif italic text-sm">{item.name}</span>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-taupe/70 uppercase tracking-tighter mt-1">
                            <span>Size: {item.size}</span>
                            <span>Price: {item.price.toLocaleString()} ₽</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 md:p-5 text-right align-top">
                    <div className="text-base md:text-lg font-serif italic text-espresso">{Number(order.total_amount).toLocaleString()} ₽</div>
                    <span className="text-[8px] uppercase tracking-widest text-gold bg-gold/5 px-2 py-0.5 rounded mt-1 inline-block">
                      {order.payment_method || 'Card'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}