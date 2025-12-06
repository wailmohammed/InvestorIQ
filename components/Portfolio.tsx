import React from 'react';
import { Portfolio as PortfolioType } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Plus, Download } from 'lucide-react';

interface PortfolioProps {
  portfolio: PortfolioType;
}

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

const Portfolio: React.FC<PortfolioProps> = ({ portfolio }) => {
  const allocationData = portfolio.holdings.map(h => ({
    name: h.stock.ticker,
    value: h.equity
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-slate-900">Portfolio Holdings</h2>
           <p className="text-slate-500">Manage and track your asset allocation.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
            <Download size={16} /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 text-sm font-medium">
            <Plus size={16} /> Add Holding
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Allocation Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-1">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Allocation</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{paddingTop: '20px', fontSize: '12px'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Holdings Table */}
        <div className="bg-white p-0 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
             <h3 className="text-lg font-bold text-slate-900">Assets</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Ticker</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Shares</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Avg Price</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Value</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Gain/Loss</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Allocation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {portfolio.holdings.map((h, index) => {
                  const allocPercent = (h.equity / portfolio.totalValue) * 100;
                  return (
                    <tr key={h.stock.ticker} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-8 rounded-sm`} style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                          <div>
                            <div className="font-bold text-slate-800">{h.stock.ticker}</div>
                            <div className="text-xs text-slate-500">{h.stock.sector}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-700">{h.shares}</td>
                      <td className="px-6 py-4 text-right text-slate-700">${h.avgCost.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right font-medium text-slate-800">${h.equity.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">
                        <div className={h.totalReturn >= 0 ? 'text-green-500 font-medium' : 'text-red-500 font-medium'}>
                          {h.totalReturn >= 0 ? '+' : ''}{h.totalReturnPercent.toFixed(2)}%
                        </div>
                        <div className="text-xs text-slate-400">${h.totalReturn.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-700">{allocPercent.toFixed(1)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
