import axios from "axios";
import { rateLimiter } from '@/utils/rateLimiter';

async function getTickers(addresses: any, chain: any) {
  return rateLimiter.enqueue(async () => {
    const url = "https://api.1inch.dev/token/v1.2/" + chain + "/custom";
    const config = {
      headers: {
        Authorization: "Bearer " + process.env.ONEINCH_API_KEY,
      },
      params: {
        addresses: addresses,
      },
      paramsSerializer: {
        indexes: null,
      },
    };

    try {
      const response = await axios.get(url, config);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
}

async function getPrices(addresses: string[], chain: string) {
  return rateLimiter.enqueue(async () => {
    const addressesString = addresses.join(",");
    const url = `https://api.1inch.dev/price/v1.1/${chain}`;
    const config = {
      headers: {
        Authorization: `Bearer ${process.env.ONEINCH_API_KEY}`,
      },
      params: {
        currency: "USD",
        addresses: addressesString,
      },
    };

    try {
      const response = await axios.get(url, config);
      return response.data;
    } catch (error: any) {
      console.error(
        "Error fetching prices:",
        error.response?.data || error.message
      );
      return {};
    }
  });
}

async function getBalancesHandler(req: any, res: any) {
  try {
    const chain = req?.body.chain || "8453";
    const address = req.body.address || "0x30f87e92c06DC163Be8baF686c021a1Bc1FF6618";

    if (!address) {
      return res.status(400).json({ 
        error: "Missing required fields, address are required" 
      });
    }

    // Rate limit the initial balances request
    const balancesResponse = await rateLimiter.enqueue(async () => {
      const url = `https://api.1inch.dev/balance/v1.2/${chain}/balances/${address}`;
      const config = {
        headers: { Authorization: `Bearer ${process.env.ONEINCH_API_KEY}` },
      };
      return axios.get(url, config);
    });

    const onlyBalances = balancesResponse.data;
    const addresses = Object.entries(onlyBalances)
      .filter(([_, balance]) => balance !== "0")
      .map(([address]) => address);

    // Fetch tickers and prices in parallel but with rate limiting
    const [tickers, prices] = await Promise.all([
      getTickers(addresses, chain),
      getPrices(addresses, chain),
    ]);

    const balances = addresses.map((address) => ({
      address,
      balance: onlyBalances[address],
      price: prices?.[address] || 0,
      ...(tickers?.[address] || {}),
    }));

    return res.status(200).json(balances);
  } catch (error: any) {
    console.error("Error in getBalances Handler:", error.message);
    return res.status(500).json({ error: error.message });
  }
}

export default getBalancesHandler;
