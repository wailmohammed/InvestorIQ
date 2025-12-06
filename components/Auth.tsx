
import React, { useState } from 'react';
import { PlanTier, UserRole, UserProfile } from '../types';
import { Lock, Mail, ArrowRight, ShieldCheck, User } from 'lucide-react';

interface AuthProps {
  onLogin: (user: UserProfile) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock login success
      onLogin({
        id: '1',
        name: email.split('@')[0] || 'User',
        email: email,
        plan: PlanTier.FREE,
        role: UserRole.USER,
        joinedAt: new Date().toISOString(),
        status: 'ACTIVE'
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleDemoLogin = (role: UserRole) => {
    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        id: role === UserRole.SUPER_ADMIN ? '99' : '1',
        name: role === UserRole.SUPER_ADMIN ? 'Super Admin' : 'Demo User',
        email: role === UserRole.SUPER_ADMIN ? 'admin@investiq.com' : 'user@investiq.com',
        plan: role === UserRole.SUPER_ADMIN ? PlanTier.ELITE : PlanTier.PRO,
        role: role,
        joinedAt: new Date().toISOString(),
        status: 'ACTIVE'
      });
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[100px]"></div>
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative z-10 animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white text-xl mx-auto mb-4 shadow-lg shadow-blue-200">
            IQ
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome to InvestIQ</h1>
          <p className="text-slate-500 mt-2">The intelligent platform for modern investors.</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
          >
            {isLoading ? (
               <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
               <>
                 {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={18} />
               </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-slate-500 hover:text-blue-600 font-medium"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100">
           <p className="text-xs text-center text-slate-400 mb-4 uppercase tracking-wider font-semibold">Quick Access (Demo)</p>
           <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleDemoLogin(UserRole.USER)}
                className="py-2 px-4 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2"
              >
                <User size={16} /> User
              </button>
              <button 
                onClick={() => handleDemoLogin(UserRole.SUPER_ADMIN)}
                className="py-2 px-4 border border-purple-200 bg-purple-50 rounded-lg text-sm text-purple-700 hover:bg-purple-100 flex items-center justify-center gap-2"
              >
                <ShieldCheck size={16} /> Admin
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
