"use client";
import React, { useState, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';

type TimeFrame = '7d' | '30d' | '1y' | 'all';

export default function SalesDashboardClient({ initialOrders }: { initialOrders: any[] }) {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('30d');

  // 1. Filter Logic by Timeframe
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

  // 2. Data for Revenue Area Chart (Grouped by Date)
  const revenueData = useMemo(() => {
    const groups = filteredOrders.reduce((acc: any, order: any) => {
      const date = new Date(order.created_at).toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' });
      acc[date] = (acc[date] || 0) + Number(order.total_amount);
      return acc;
    }, {});
    return Object.entries(groups).map(([name, total]) => ({ name, total })).reverse();
  }, [filteredOrders]);

  // 3. Data for Product Performance Bar Chart
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
      .slice(0, 5); // Show top 5
  }, [filteredOrders]);

  const totalRevenue = filteredOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);

  return (
    <div className="p-8 bg-bone min-h-screen font-sans animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-8 border-b border-taupe/10 pb-8">
        <div>
          <span className="text-[10px] uppercase tracking-[0.5em] text-taupe font-bold">AETHER Intelligence</span>
          <h1 className="text-5xl font-serif italic text-espresso mt-2">Sales Analytics</h1>
        </div>

        <div className="flex bg-white border border-taupe/10 p-1 rounded-sm shadow-sm">
          {(['7d', '30d', '1y', 'all'] as TimeFrame[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeFrame(tf)}
              className={`px-6 py-2 text-[9px] uppercase tracking-widest transition-all ${
                timeFrame === tf ? 'bg-espresso text-bone' : 'text-taupe hover:text-espresso'
              }`}
            >
              {tf === '7d' ? 'Week' : tf === '30d' ? 'Month' : tf === '1y' ? 'Year' : 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* CHART 1: REVENUE AREA */}
        <div className="bg-white border border-taupe/10 p-8 h-[350px] shadow-sm">
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
              <YAxis fontSize={9} tickLine={false} axisLine={false} tickFormatter={(v) => `${v/1000}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1A1A1A', border: 'none', borderRadius: '0' }}
                itemStyle={{ color: '#C5A059', fontSize: '11px' }}
                labelStyle={{ color: '#F1F1F1', fontSize: '9px' }}
              />
              <Area type="monotone" dataKey="total" stroke="#C5A059" fill="url(#colorRev)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* CHART 2: TOP PRODUCTS BAR */}
        <div className="bg-white border border-taupe/10 p-8 h-[350px] shadow-sm">
          <p className="text-[10px] uppercase tracking-widest text-taupe mb-6 font-bold">Top Performing Pieces</p>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={productData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F1F1" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" fontSize={9} width={80} tickLine={false} axisLine={false} />
              <Tooltip cursor={{fill: '#F9F8F6'}} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                {productData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#C5A059' : '#1A1A1A'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TRANSACTION MANIFEST */}
      <div className="bg-white border border-taupe/10 shadow-sm">
        <div className="p-6 border-b border-taupe/10 flex justify-between items-center">
          <h2 className="text-xs uppercase tracking-[0.3em] text-espresso font-bold">Transaction Manifest</h2>
          <span className="text-[10px] text-taupe italic">{totalRevenue.toLocaleString()} ₽ Total for period</span>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-espresso text-bone text-[9px] uppercase tracking-[0.3em]">
              <th className="p-5 font-light">Timestamp</th>
              <th className="p-5 font-light">Product Detail</th>
              <th className="p-5 font-light text-right">Settlement</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-taupe/5">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-bone/30 transition-all">
                <td className="p-5 whitespace-nowrap">
                  <div className="text-espresso font-medium text-xs">
                    {new Date(order.created_at).toLocaleDateString('ru-RU')}
                  </div>
                  <div className="text-[9px] text-taupe uppercase mt-1">
                    {new Date(order.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </td>
                <td className="p-5">
                  <div className="space-y-2">
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex flex-col border-l-2 border-gold/20 pl-3 py-1">
                        <span className="text-espresso font-serif italic text-sm">{item.name}</span>
                        <div className="flex gap-4 text-[10px] text-taupe/70 uppercase tracking-tighter">
                          <span>Size: {item.size}</span>
                          <span>Price: {item.price.toLocaleString()} ₽</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="p-5 text-right">
                  <div className="text-lg font-serif italic text-espresso">{Number(order.total_amount).toLocaleString()} ₽</div>
                  <span className="text-[8px] uppercase tracking-widest text-gold bg-gold/5 px-2 py-0.5 rounded">
                    {order.payment_method || 'Card'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}