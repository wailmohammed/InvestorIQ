
import React, { useState } from 'react';
import { UserProfile, PlanTier, UserRole, Brokerage, CryptoWallet } from '../types';
import { Users, DollarSign, Activity, Search, Shield, Trash2, Edit2, CheckCircle, XCircle, Globe, Wallet, Plus, Monitor } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface AdminDashboardProps {
  currentUser: UserProfile;
  brokerages: Brokerage[];
  setBrokerages: React.Dispatch<React.SetStateAction<Brokerage[]>>;
  wallets: CryptoWallet[];
  setWallets: React.Dispatch<React.SetStateAction<CryptoWallet[]>>;
}

// Mock Data
const MOCK_USERS: UserProfile[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', plan: PlanTier.FREE, role: UserRole.USER, joinedAt: '2023-10-12', status: 'ACTIVE' },
  { id: '2', name: 'Sarah Smith', email: 'sarah@finance.com', plan: PlanTier.ELITE, role: UserRole.USER, joinedAt: '2023-11-05', status: 'ACTIVE' },
  { id: '3', name: 'Mike Ross', email: 'mike@firm.com', plan: PlanTier.PRO, role: UserRole.USER, joinedAt: '2024-01-15', status: 'SUSPENDED' },
  { id: '4', name: 'Admin User', email: 'admin@investiq.com', plan: PlanTier.ELITE, role: UserRole.SUPER_ADMIN, joinedAt: '2023-01-01', status: 'ACTIVE' },
  { id: '5', name: 'Jane Doe', email: 'jane@example.com', plan: PlanTier.FREE, role: UserRole.USER, joinedAt: '2024-02-20', status: 'ACTIVE' },
];

const REVENUE_DATA = [
  { name: 'Jan', amount: 4500 },
  { name: 'Feb', amount: 5200 },
  { name: 'Mar', amount: 4800 },
  { name: 'Apr', amount: 6100 },
  { name: 'May', amount: 7500 },
  { name: 'Jun', amount: 8200 },
];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser, brokerages, setBrokerages, wallets, setWallets }) => {
  const [activeTab, setActiveTab] = useState<'USERS' | 'BROKERAGES' | 'PAYMENTS'>('USERS');
  const [users, setUsers] = useState<UserProfile[]>(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState('');

  // Brokerage State
  const [newBrokerName, setNewBrokerName] = useState('');
  
  // Wallet State
  const [newWalletLabel, setNewWalletLabel] = useState('');
  const [newWalletAddress, setNewWalletAddress] = useState('');
  const [newWalletNetwork, setNewWalletNetwork] = useState('');

  const handleDeleteUser = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' } : u));
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddBrokerage = () => {
    if(newBrokerName) {
      setBrokerages([...brokerages, {
        id: Date.now().toString(),
        name: newBrokerName,
        logoChar: newBrokerName[0].toUpperCase(),
        status: 'ACTIVE',
        colorClass: 'text-purple-600 bg-purple-100'
      }]);
      setNewBrokerName('');
    }
  };

  const handleDeleteBrokerage = (id: string) => {
     setBrokerages(brokerages.filter(b => b.id !== id));
  };

  const handleAddWallet = () => {
    if(newWalletLabel && newWalletAddress && newWalletNetwork) {
      setWallets([...wallets, {
        id: Date.now().toString(),
        network: newWalletNetwork,
        address: newWalletAddress,
        label: newWalletLabel
      }]);
      setNewWalletLabel('');
      setNewWalletAddress('');
      setNewWalletNetwork('');
    }
  };

  const handleDeleteWallet = (id: string) => {
     setWallets(wallets.filter(w => w.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Admin Console</h2>
          <p className="text-slate-500">System overview and management.</p>
        </div>
        <div className="flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
          <Shield size={12} /> {currentUser.role.replace('_', ' ')}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200">
         <button 
           onClick={() => setActiveTab('USERS')}
           className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'USERS' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
         >
           User Management
         </button>
         <button 
           onClick={() => setActiveTab('BROKERAGES')}
           className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'BROKERAGES' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
         >
           Brokerage Integrations
         </button>
         {currentUser.role === UserRole.SUPER_ADMIN && (
           <button 
             onClick={() => setActiveTab('PAYMENTS')}
             className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'PAYMENTS' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
           >
             Payment Systems
           </button>
         )}
      </div>

      {activeTab === 'USERS' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center">
               <h3 className="font-bold text-slate-900">Users</h3>
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search users..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                  />
               </div>
             </div>
             
             <div className="overflow-x-auto">
               <table className="w-full text-left text-sm">
                 <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-xs">
                   <tr>
                     <th className="px-6 py-4">User</th>
                     <th className="px-6 py-4">Role</th>
                     <th className="px-6 py-4">Plan</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4 text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {filteredUsers.map((user) => (
                     <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                       <td className="px-6 py-4">
                         <div className="font-medium text-slate-900">{user.name}</div>
                         <div className="text-xs text-slate-500">{user.email}</div>
                       </td>
                       <td className="px-6 py-4">
                         <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${user.role === UserRole.SUPER_ADMIN ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-600'}`}>
                           {user.role}
                         </span>
                       </td>
                       <td className="px-6 py-4">
                          <span className={`font-medium ${user.plan === PlanTier.ELITE ? 'text-amber-600' : user.plan === PlanTier.PRO ? 'text-blue-600' : 'text-slate-500'}`}>
                            {user.plan}
                          </span>
                       </td>
                       <td className="px-6 py-4">
                         <span className={`inline-flex items-center gap-1 text-xs font-medium ${user.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'}`}>
                            {user.status === 'ACTIVE' ? <CheckCircle size={12}/> : <XCircle size={12}/>}
                            {user.status}
                         </span>
                       </td>
                       <td className="px-6 py-4 text-right">
                         <div className="flex justify-end gap-2">
                            <button onClick={() => handleToggleStatus(user.id)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDeleteUser(user.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 size={16} />
                            </button>
                         </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
             <h3 className="font-bold text-slate-900 mb-6">Revenue Overview</h3>
             <div className="h-[250px]">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={REVENUE_DATA}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                   <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} tickFormatter={(v) => `$${v}`} />
                   <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                   <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 4, 4]} />
                 </BarChart>
               </ResponsiveContainer>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'BROKERAGES' && (
         <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 animate-fade-in">
           <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Globe size={20}/> Supported Brokerages</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {brokerages.map(b => (
                 <div key={b.id} className="border border-slate-200 rounded-xl p-4 flex justify-between items-center bg-slate-50">
                    <div className="flex items-center gap-3">
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${b.colorClass}`}>
                          {b.logoChar}
                       </div>
                       <div>
                          <div className="font-bold text-slate-800">{b.name}</div>
                          <div className="text-xs text-green-600 font-medium">{b.status}</div>
                       </div>
                    </div>
                    <button onClick={() => handleDeleteBrokerage(b.id)} className="text-slate-400 hover:text-red-500">
                       <Trash2 size={18} />
                    </button>
                 </div>
              ))}
              <div className="border border-dashed border-slate-300 rounded-xl p-4 flex flex-col justify-center items-center gap-2 text-slate-400 bg-white">
                 <input 
                   className="w-full text-center text-sm border-b border-slate-200 focus:border-blue-500 focus:outline-none pb-1"
                   placeholder="New Broker Name"
                   value={newBrokerName}
                   onChange={e => setNewBrokerName(e.target.value)}
                 />
                 <button onClick={handleAddBrokerage} className="text-xs font-bold text-blue-600 hover:underline uppercase">Add Integration</button>
              </div>
           </div>
         </div>
      )}

      {activeTab === 'PAYMENTS' && currentUser.role === UserRole.SUPER_ADMIN && (
         <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 animate-fade-in">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Wallet size={20}/> Crypto Wallets Config</h3>
            <p className="text-slate-500 text-sm mb-6">Manage receiving addresses for crypto payments.</p>
            
            <div className="space-y-4">
              {wallets.map(w => (
                 <div key={w.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50">
                    <div className="flex items-start gap-4">
                       <div className="p-3 bg-white rounded-lg border border-slate-100 shadow-sm text-slate-700">
                          <Monitor size={20} />
                       </div>
                       <div>
                          <h4 className="font-bold text-slate-800">{w.label}</h4>
                          <p className="text-sm text-slate-500 font-mono break-all">{w.address}</p>
                          <span className="inline-block mt-1 text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded uppercase tracking-wider font-semibold">{w.network}</span>
                       </div>
                    </div>
                    <button onClick={() => handleDeleteWallet(w.id)} className="mt-3 md:mt-0 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2">
                       <Trash2 size={16} /> Remove
                    </button>
                 </div>
              ))}

              <div className="mt-6 pt-6 border-t border-slate-100">
                 <h4 className="font-bold text-slate-700 mb-4">Add New Receiving Address</h4>
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <input 
                      placeholder="Label (e.g. Treasury)" 
                      className="border border-slate-200 rounded-lg px-4 py-2 text-sm"
                      value={newWalletLabel}
                      onChange={e => setNewWalletLabel(e.target.value)}
                    />
                    <select
                      className="border border-slate-200 rounded-lg px-4 py-2 text-sm bg-white"
                      value={newWalletNetwork}
                      onChange={e => setNewWalletNetwork(e.target.value)}
                    >
                      <option value="">Select Network</option>
                      <option value="BTC">Bitcoin (BTC)</option>
                      <option value="ERC20">Ethereum (ERC20)</option>
                      <option value="TRC20">Tron (TRC20)</option>
                      <option value="XRP">Ripple (XRP)</option>
                      <option value="DOGE">Dogecoin (DOGE)</option>
                    </select>
                    <input 
                      placeholder="Wallet Address" 
                      className="border border-slate-200 rounded-lg px-4 py-2 text-sm font-mono md:col-span-2"
                      value={newWalletAddress}
                      onChange={e => setNewWalletAddress(e.target.value)}
                    />
                 </div>
                 <button onClick={handleAddWallet} className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors">
                    <Plus size={16} /> Add Wallet
                 </button>
              </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default AdminDashboard;
