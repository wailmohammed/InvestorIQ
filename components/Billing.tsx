
import React, { useState } from 'react';
import { PlanTier, UserProfile, Transaction } from '../types';
import { Check, CreditCard, Wallet, Zap, History, Download } from 'lucide-react';

interface BillingProps {
  user: UserProfile;
  onUpdatePlan: (plan: PlanTier) => void;
}

const PLANS = [
  {
    id: PlanTier.FREE,
    name: 'Starter',
    price: 0,
    features: ['Basic Portfolio Tracking', 'Manual Entry', 'Community Access', 'Limited AI Insights'],
  },
  {
    id: PlanTier.PRO,
    name: 'Pro',
    price: 10,
    features: ['Unlimited Portfolios', 'Auto-Import (API/CSV)', 'Advanced Analytics', 'Full AI Advisor Access', 'Dividend Projections'],
    popular: true,
  },
  {
    id: PlanTier.ELITE,
    name: 'Elite',
    price: 25,
    features: ['Priority Support', 'Tax Reporting', 'Multiple Users', 'API Access', 'Custom Alerts & Reports', '1-on-1 Strategy Calls'],
  },
];

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'tx_123', date: '2024-03-01', amount: 10.00, status: 'COMPLETED', method: 'PAYPAL', description: 'InvestIQ Pro - Monthly' },
  { id: 'tx_122', date: '2024-02-01', amount: 10.00, status: 'COMPLETED', method: 'CREDIT_CARD', description: 'InvestIQ Pro - Monthly' },
  { id: 'tx_121', date: '2024-01-01', amount: 10.00, status: 'COMPLETED', method: 'CRYPTO', description: 'InvestIQ Pro - Monthly (ETH)' },
];

const Billing: React.FC<BillingProps> = ({ user, onUpdatePlan }) => {
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'PAYPAL' | 'CRYPTO'>('CARD');
  const [processing, setProcessing] = useState(false);

  const handleUpgrade = (planId: PlanTier) => {
    if (planId === user.plan) return;
    
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      onUpdatePlan(planId);
      setProcessing(false);
      alert(`Successfully switched to ${planId} plan via ${paymentMethod}!`);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Billing & Subscription</h2>
        <p className="text-slate-500">Manage your plan and payment methods.</p>
      </div>

      {/* Plan Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => (
          <div 
            key={plan.id} 
            className={`relative bg-white rounded-2xl p-6 border transition-all ${user.plan === plan.id ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-lg' : 'border-slate-100 shadow-sm hover:border-slate-300'}`}
          >
            {plan.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                Most Popular
              </div>
            )}
            
            <div className="mb-4">
              <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-bold text-slate-900">${plan.price}</span>
                <span className="text-slate-500 text-sm">/month</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                  <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleUpgrade(plan.id)}
              disabled={user.plan === plan.id || processing}
              className={`w-full py-3 rounded-xl font-bold transition-all ${
                user.plan === plan.id 
                  ? 'bg-slate-100 text-slate-400 cursor-default' 
                  : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200'
              }`}
            >
              {processing ? 'Processing...' : user.plan === plan.id ? 'Current Plan' : plan.price === 0 ? 'Downgrade' : 'Upgrade'}
            </button>
          </div>
        ))}
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Payment Method</h3>
        <div className="flex flex-col md:flex-row gap-4">
          <button 
            onClick={() => setPaymentMethod('CARD')}
            className={`flex-1 p-4 border rounded-xl flex items-center gap-4 transition-all ${paymentMethod === 'CARD' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-slate-300'}`}
          >
            <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
              <CreditCard size={24} className={paymentMethod === 'CARD' ? 'text-blue-600' : 'text-slate-400'} />
            </div>
            <div className="text-left">
              <div className="font-bold">Credit Card</div>
              <div className="text-xs opacity-70">Visa, Mastercard, Amex</div>
            </div>
          </button>

          <button 
            onClick={() => setPaymentMethod('PAYPAL')}
            className={`flex-1 p-4 border rounded-xl flex items-center gap-4 transition-all ${paymentMethod === 'PAYPAL' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-slate-300'}`}
          >
            <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.5 7.5H16.5C16.5 7.5 16.5 6.5 15.5 5.5C14.5 4.5 13 4.5 13 4.5H7.5L5.5 19.5H9.5L10 16H12.5C12.5 16 15 16 16.5 14C18 12 18.5 9.5 18.5 7.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="text-left">
              <div className="font-bold">PayPal</div>
              <div className="text-xs opacity-70">Connect account</div>
            </div>
          </button>

          <button 
            onClick={() => setPaymentMethod('CRYPTO')}
            className={`flex-1 p-4 border rounded-xl flex items-center gap-4 transition-all ${paymentMethod === 'CRYPTO' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-slate-300'}`}
          >
            <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
              <Wallet size={24} className={paymentMethod === 'CRYPTO' ? 'text-blue-600' : 'text-slate-400'} />
            </div>
            <div className="text-left">
              <div className="font-bold">Crypto</div>
              <div className="text-xs opacity-70">ETH, BTC, USDC</div>
            </div>
          </button>
        </div>

        {paymentMethod === 'CRYPTO' && (
          <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center">
             <Zap size={24} className="mx-auto text-amber-500 mb-2" />
             <p className="text-sm font-medium text-slate-700">Connect Web3 Wallet</p>
             <p className="text-xs text-slate-500 mb-3">Pay with MetaMask, WalletConnect, or Coinbase Wallet.</p>
             <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold">Connect Wallet</button>
          </div>
        )}
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
         <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Payment History</h3>
            <button className="text-blue-600 text-sm font-medium flex items-center gap-1">
               <Download size={14} /> Export CSV
            </button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-xs">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Method</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_TRANSACTIONS.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-600">{tx.date}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{tx.description}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-1 rounded text-xs">
                        {tx.method === 'CRYPTO' ? <Wallet size={10} /> : tx.method === 'PAYPAL' ? 'PP' : <CreditCard size={10}/>}
                        {tx.method}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-900 font-mono">${tx.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">
                       <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold">
                         {tx.status}
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
};

export default Billing;
