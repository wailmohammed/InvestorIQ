
const API_BASE_URL = 'http://localhost:8000'; // Adjust if deployed

export interface MarketData {
  ticker: string;
  price: number;
  source: string;
  error?: string;
}

export const fetchLivePrice = async (ticker: string): Promise<number | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/price/${ticker}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.price;
  } catch (error) {
    console.warn(`Failed to fetch live price for ${ticker}:`, error);
    return null;
  }
};

export const fetchLivePrices = async (tickers: string[]): Promise<Record<string, number>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/prices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tickers })
    });
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    const prices: Record<string, number> = {};
    
    Object.keys(data).forEach(key => {
        if (data[key].price) {
            prices[key] = data[key].price;
        }
    });
    return prices;
  } catch (error) {
    console.warn(`Failed to fetch bulk prices:`, error);
    return {};
  }
};
