// Function to fetch current SOL price in INR from CoinGecko API
async function getCurrentSOLPrice(): Promise<number> {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=inr');
    const data = await response.json();
    return data.solana.inr;
  } catch (error) {
    console.error('Error fetching SOL price:', error);
    // Fallback to a default price in case of API failure
    return 10000;
  }
}

export const convertINRtoSOL = async (inrAmount: number): Promise<number> => {
  const currentPrice = await getCurrentSOLPrice();
  return inrAmount / currentPrice;
};

export const convertSOLtoINR = async (solAmount: number): Promise<number> => {
  const currentPrice = await getCurrentSOLPrice();
  return solAmount * currentPrice;
}; 