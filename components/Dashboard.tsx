import React, { useMemo } from 'react';
import { Portfolio } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ArrowUpRight, DollarSign, Wallet } from 'lucide-react';
import { MONTHLY_DIVIDENDS_DATA } from '../constants';

interface DashboardProps {
  portfolio: Portfolio;
}

const Dashboard: React.FC<DashboardProps> = ({ portfolio }) => {
  // Mock performance data for the chart
  const performanceData = useMemo(() => [
    { name: 'Jan', value: 45000 },
    { name: 'Feb', value: 46200 },
    { name: 'Mar', value: 45800 },
    { name: 'Apr', value: 47500 },
    { name: 'May', value: 48900 },
    { name: 'Jun', value: 48500 },
  ], []);

  // Custom Tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const currentValue = payload[0].value;
      const index = performanceData.findIndex(d => d.name === label);
      let changeText = '';
      
      if (index > 0) {
        const prevValue = performanceData[index - 1].value;
        const diff = currentValue - prevValue;
        const percent = ((diff / prevValue) * 100).toFixed(2);
        const sign = diff >= 0 ? '+' : '';
        changeText = `${sign}$${diff.toLocaleString()} (${sign}${percent}%)`;
      } else {
         changeText = "Start of period";
      }

      return (
        <div className="bg-white p-3 border border-slate-100 shadow-lg rounded-xl">
          <p className="font-bold text-slate-900">{label}</p>
          <p className="text-blue-600 font-medium">${currentValue.toLocaleString()}</p>
          <p className={`text-xs ${changeText.includes('-') ? 'text-red-500' : 'text-green-500'}`}>
            {changeText}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
          <p className="text-slate-500">Welcome back, here's your financial overview.</p>
        </div>
        <div className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
          Last updated: Just now
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Wallet size={20} />
            </div>
            <span className="flex items-center text-green-600 text-sm font-medium bg-green-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight size={14} className="mr-1" /> +2.4%
            </span>
          </div>
          <p className="text-slate-500 text-sm font-medium">Net Worth</p>
          <h3 className="text-3xl font-bold text-slate-900">${portfolio.totalValue.toLocaleString()}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
              <DollarSign size={20} />
            </div>
            <span className="flex items-center text-green-600 text-sm font-medium bg-green-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight size={14} className="mr-1" /> +12% YoY
            </span>
          </div>
          <p className="text-slate-500 text-sm font-medium">Annual Dividends</p>
          <h3 className="text-3xl font-bold text-slate-900">${portfolio.totalDividendIncome.toLocaleString()}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <ArrowUpRight size={20} />
            </div>
             <span className="text-slate-400 text-sm">All Time</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">Total Return</p>
          <h3 className="text-3xl font-bold text-slate-900">
             ${portfolio.holdings.reduce((acc, h) => acc + h.totalReturn, 0).toLocaleString()}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
              <ArrowUpRight size={20} />
            </div>
            <span className="text-slate-400 text-sm">Yield</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">Dividend Yield</p>
          <h3 className="text-3xl font-bold text-slate-900">{portfolio.dividendYield.toFixed(2)}%</h3>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio Value Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Portfolio Performance</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dividend Bar Chart Small */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <h3 className="text-lg font-bold text-slate-900 mb-6">Income Preview</h3>
           <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={MONTHLY_DIVIDENDS_DATA}>
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                 <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                 <Bar dataKey="amount" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>
      
      {/* Top Movers Mockup */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Top Holdings</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-3 pl-2 text-xs font-semibold text-slate-400 uppercase">Ticker</th>
                <th className="pb-3 text-xs font-semibold text-slate-400 uppercase">Name</th>
                <th className="pb-3 text-xs font-semibold text-slate-400 uppercase text-right">Price</th>
                <th className="pb-3 text-xs font-semibold text-slate-400 uppercase text-right">Value</th>
                <th className="pb-3 pr-2 text-xs font-semibold text-slate-400 uppercase text-right">Return</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {portfolio.holdings.slice(0, 5).map((h) => (
                <tr key={h.stock.ticker} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 pl-2 font-medium text-slate-700">{h.stock.ticker}</td>
                  <td className="py-4 text-slate-600">{h.stock.name}</td>
                  <td className="py-4 text-right text-slate-700">${h.stock.price.toFixed(2)}</td>
                  <td className="py-4 text-right text-slate-700 font-medium">${h.equity.toLocaleString()}</td>
                  <td className={`py-4 pr-2 text-right font-medium ${h.totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {h.totalReturn >= 0 ? '+' : ''}{h.totalReturnPercent.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;