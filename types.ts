export interface Stock {
  ticker: string;
  name: string;
  sector: string;
  price: number;
  dividendYield: number; // Percentage, e.g., 3.5
  dividendFrequency: 'Monthly' | 'Quarterly' | 'Annually';
  logoUrl?: string;
}

export interface Holding {
  stock: Stock;
  shares: number;
  avgCost: number;
  equity: number;
  totalReturn: number;
  totalReturnPercent: number;
}

export interface Portfolio {
  holdings: Holding[];
  totalValue: number;
  totalDividendIncome: number;
  dividendYield: number;
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
  DASHBOARD = 'DASHBOARD',
  PORTFOLIO = 'PORTFOLIO',
  DIVIDENDS = 'DIVIDENDS',
  COMMUNITY = 'COMMUNITY',
  ANALYZER = 'ANALYZER'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
