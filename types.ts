
export interface Stock {
  ticker: string;
  name: string;
  sector: string;
  price: number;
  dividendYield: number; // Percentage, e.g., 3.5
  dividendFrequency: 'Monthly' | 'Quarterly' | 'Annually';
  logoUrl?: string;
  dividendSafetyScore?: number; // 0-100 (Simply Safe Dividends style)
}

export interface Holding {
  stock: Stock;
  shares: number;
  avgCost: number;
  equity: number;
  totalReturn: number;
  totalReturnPercent: number;
  dripEnabled?: boolean; // For Dividend Reinvestment simulation
  targetAllocation?: number; // For Passiv style rebalancing
}

export interface Portfolio {
  holdings: Holding[];
  totalValue: number;
  totalDividendIncome: number;
  dividendYield: number;
}

export interface PortfolioContainer {
  id: string;
  name: string;
  holdings: Holding[];
  isDefault: boolean;
}

export interface SocialPost {
  id: string;
  user: string;
  avatar: string;
  content: string;
  ticker?: string;
  likes: number;
  comments: number;
  timestamp: string;
  sentiment?: 'Bullish' | 'Bearish' | 'Neutral';
}

export enum ViewState {
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  PORTFOLIO = 'PORTFOLIO',
  DIVIDENDS = 'DIVIDENDS',
  COMMUNITY = 'COMMUNITY',
  ANALYZER = 'ANALYZER',
  ADMIN = 'ADMIN',
  BILLING = 'BILLING',
  SETTINGS = 'SETTINGS'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Alert {
  id: string;
  ticker: string;
  condition: 'ABOVE' | 'BELOW' | 'CHANGE_PCT';
  value: number; // Price target or Percentage value
  active: boolean;
  triggered?: boolean;
  baselinePrice?: number; // Reference price for percentage change
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'ALERT' | 'SYSTEM' | 'DIVIDEND';
}

export enum PlanTier {
  FREE = 'FREE',
  PRO = 'PRO',
  ELITE = 'ELITE'
}

export interface PlanConfig {
  id: PlanTier;
  name: string;
  price: number;
  trialDays: number;
  features: string[];
  popular?: boolean;
}

export interface Promotion {
  id: string;
  code: string;
  discountPercent: number;
  expiryDate: string;
  active: boolean;
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  plan: PlanTier;
  role: UserRole;
  avatar?: string;
  joinedAt: string;
  status: 'ACTIVE' | 'SUSPENDED';
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  method: 'PAYPAL' | 'CRYPTO' | 'CREDIT_CARD';
  description: string;
}

export interface Brokerage {
  id: string;
  name: string;
  logoChar: string;
  status: 'ACTIVE' | 'MAINTENANCE';
  colorClass: string;
}

export interface CryptoWallet {
  id: string;
  network: string;
  address: string;
  label: string;
}
