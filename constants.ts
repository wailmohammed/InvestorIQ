
import { Holding, Portfolio, SocialPost, Stock, Brokerage, CryptoWallet, PlanTier } from './types';

export const MOCK_STOCKS: Record<string, Stock> = {
  AAPL: { ticker: 'AAPL', name: 'Apple Inc.', sector: 'Technology', price: 185.92, dividendYield: 0.52, dividendFrequency: 'Quarterly', logoUrl: 'https://logo.clearbit.com/apple.com', dividendSafetyScore: 99 },
  MSFT: { ticker: 'MSFT', name: 'Microsoft Corp.', sector: 'Technology', price: 402.56, dividendYield: 0.71, dividendFrequency: 'Quarterly', logoUrl: 'https://logo.clearbit.com/microsoft.com', dividendSafetyScore: 99 },
  O: { ticker: 'O', name: 'Realty Income', sector: 'Real Estate', price: 53.40, dividendYield: 5.75, dividendFrequency: 'Monthly', logoUrl: 'https://logo.clearbit.com/realtyincome.com', dividendSafetyScore: 80 },
  SCHD: { ticker: 'SCHD', name: 'Schwab US Dividend Equity ETF', sector: 'ETF', price: 77.20, dividendYield: 3.45, dividendFrequency: 'Quarterly', logoUrl: 'https://logo.clearbit.com/schwab.com', dividendSafetyScore: 90 },
  JNJ: { ticker: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare', price: 155.20, dividendYield: 3.05, dividendFrequency: 'Quarterly', logoUrl: 'https://logo.clearbit.com/jnj.com', dividendSafetyScore: 95 },
  KO: { ticker: 'KO', name: 'Coca-Cola Co.', sector: 'Consumer Defensive', price: 59.80, dividendYield: 3.12, dividendFrequency: 'Quarterly', logoUrl: 'https://logo.clearbit.com/coca-colacompany.com', dividendSafetyScore: 92 },
  NVDA: { ticker: 'NVDA', name: 'NVIDIA Corp.', sector: 'Technology', price: 780.00, dividendYield: 0.02, dividendFrequency: 'Quarterly', logoUrl: 'https://logo.clearbit.com/nvidia.com', dividendSafetyScore: 60 },
  V: { ticker: 'V', name: 'Visa Inc.', sector: 'Financial Services', price: 280.45, dividendYield: 0.75, dividendFrequency: 'Quarterly', logoUrl: 'https://logo.clearbit.com/visa.com', dividendSafetyScore: 97 },
};

export const INITIAL_HOLDINGS: Holding[] = [
  { stock: MOCK_STOCKS.AAPL, shares: 50, avgCost: 145.00, equity: 9296, totalReturn: 2046, totalReturnPercent: 28.2, dripEnabled: false, targetAllocation: 20 },
  { stock: MOCK_STOCKS.MSFT, shares: 20, avgCost: 310.00, equity: 8051.2, totalReturn: 1851.2, totalReturnPercent: 29.8, dripEnabled: true, targetAllocation: 15 },
  { stock: MOCK_STOCKS.O, shares: 150, avgCost: 58.50, equity: 8010, totalReturn: -765, totalReturnPercent: -8.7, dripEnabled: true, targetAllocation: 15 },
  { stock: MOCK_STOCKS.SCHD, shares: 200, avgCost: 72.00, equity: 15440, totalReturn: 1040, totalReturnPercent: 7.2, dripEnabled: true, targetAllocation: 30 },
  { stock: MOCK_STOCKS.NVDA, shares: 10, avgCost: 450.00, equity: 7800, totalReturn: 3300, totalReturnPercent: 73.3, dripEnabled: false, targetAllocation: 20 },
];

export const MOCK_POSTS: SocialPost[] = [
  {
    id: '1',
    user: 'DividendDave',
    avatar: 'https://i.pravatar.cc/150?u=dave',
    content: 'Just added more $O to my portfolio. The monthly income is addictive! #dividends',
    ticker: 'O',
    likes: 45,
    comments: 12,
    timestamp: '2h ago',
    sentiment: 'Bullish'
  },
  {
    id: '2',
    user: 'TechTrendSetter',
    avatar: 'https://i.pravatar.cc/150?u=tech',
    content: 'Is $NVDA overvalued here? The PE ratio is getting scary, but the growth is undeniable.',
    ticker: 'NVDA',
    likes: 120,
    comments: 56,
    timestamp: '5h ago',
    sentiment: 'Neutral'
  },
  {
    id: '3',
    user: 'PassivePatricia',
    avatar: 'https://i.pravatar.cc/150?u=patricia',
    content: 'Hit a major milestone today: $1000/month in passive dividend income! 🚀',
    likes: 890,
    comments: 102,
    timestamp: '1d ago',
    sentiment: 'Bullish'
  }
];

export const MONTHLY_DIVIDENDS_DATA = [
  { name: 'Jan', amount: 120 },
  { name: 'Feb', amount: 85 },
  { name: 'Mar', amount: 350 },
  { name: 'Apr', amount: 130 },
  { name: 'May', amount: 90 },
  { name: 'Jun', amount: 380 },
  { name: 'Jul', amount: 125 },
  { name: 'Aug', amount: 95 },
  { name: 'Sep', amount: 390 },
  { name: 'Oct', amount: 135 },
  { name: 'Nov', amount: 100 },
  { name: 'Dec', amount: 410 },
];

export const DEFAULT_BROKERAGES: Brokerage[] = [
  { id: '1', name: 'Trading212', logoChar: 'T', status: 'ACTIVE', colorClass: 'text-blue-600 bg-blue-100' },
  { id: '2', name: 'Binance', logoChar: 'B', status: 'ACTIVE', colorClass: 'text-yellow-600 bg-yellow-100' },
  { id: '3', name: 'Robinhood', logoChar: 'R', status: 'ACTIVE', colorClass: 'text-green-600 bg-green-100' },
  { id: '4', name: 'IBKR', logoChar: 'I', status: 'ACTIVE', colorClass: 'text-red-600 bg-red-100' },
];

export const DEFAULT_WALLETS: CryptoWallet[] = [
  { id: '1', network: 'Ethereum (ERC20)', address: '0x71C...9A21', label: 'Main Treasury' },
  { id: '2', network: 'Bitcoin (BTC)', address: 'bc1q...8zw9', label: 'Cold Storage' },
];

export const PLAN_LIMITS = {
  [PlanTier.FREE]: { maxHoldings: 10, maxPortfolios: 1, allowApi: false },
  [PlanTier.PRO]: { maxHoldings: 50, maxPortfolios: 3, allowApi: true },
  [PlanTier.ELITE]: { maxHoldings: 9999, maxPortfolios: 10, allowApi: true },
};
