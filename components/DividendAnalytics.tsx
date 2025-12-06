import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { MONTHLY_DIVIDENDS_DATA } from '../constants';
import { Portfolio } from '../types';

interface DividendAnalyticsProps {
  portfolio: Portfolio;
}

const DividendAnalytics: React.FC<DividendAnalyticsProps> = ({ portfolio }) => {
  // Generate snowball projection data (compound interest)
  const generateSnowballData = () => {
    const data = [];
    let currentIncome = portfolio.totalDividendIncome;
    const growthRate = 0.08; // 8% dividend growth assumption
    const reinvestmentRate = 0.035; // 3.5% yield reinvested
    
    for(let i = 0; i < 10; i++) {
      data.push({
        year: 2024 + i,
        income: Math.round(currentIncome)
      });
      currentIncome = currentIncome * (1 + growthRate + reinvestmentRate);
    }
    return data;
  };

  const snowballData = generateSnowballData();

  return (
    <div className="space-y-6">
       <div>
          <h2 className="text-2xl font-bold text-slate-900">Dividend Analytics</h2>
          <p className="text-slate-500">Track your passive income growth and projections.</p>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Income Calendar</h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MONTHLY_DIVIDENDS_DATA} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} tickFormatter={(v) => `$${v}`} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-2">The Snowball Effect (10 Years)</h3>
            <p className="text-sm text-slate-500 mb-6">Projected growth with DRIP & 8% CAGR.</p>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={snowballData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} tickFormatter={(v) => `$${v}`} />
                  <Tooltip 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
       </div>

       {/* Detailed breakdown per stock */}
       <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Dividend Breakdown</h3>
          <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Ticker</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Yield</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Shares</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Annual Income</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Frequency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {portfolio.holdings.map((h) => {
                     const annualIncome = h.shares * h.stock.price * (h.stock.dividendYield / 100);
                     return (
                       <tr key={h.stock.ticker}>
                          <td className="px-6 py-4 font-bold text-slate-800">{h.stock.ticker}</td>
                          <td className="px-6 py-4 text-right text-slate-600">{h.stock.dividendYield}%</td>
                          <td className="px-6 py-4 text-right text-slate-600">{h.shares}</td>
                          <td className="px-6 py-4 text-right text-green-600 font-medium">${annualIncome.toFixed(2)}</td>
                          <td className="px-6 py-4 text-right text-slate-500">{h.stock.dividendFrequency}</td>
                       </tr>
                     );
                   })}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
};

export default DividendAnalytics;