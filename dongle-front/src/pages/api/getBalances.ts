// getBalances.ts
import axios from "axios";

async function getTickers(addresses: any, chain: any) {
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
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function getPrices(addresses: string[], chain: string) {
  // Convert addresses array to comma-separated string
  const addressesString = addresses.join(",");

  const url = `https://api.1inch.dev/price/v1.1/${chain}`;

  const config = {
    headers: {
      Authorization: `Bearer ${process.env.ONEINCH_API_KEY}`,
    },
    params: {
      currency: "USD",
      addresses: addressesString, // Send addresses as a comma-separated string
    },
  };

  try {
    const response = await axios.get(url, config);
    console.log("Prices response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching prices:",
      error.response?.data || error.message
    );
    return {}; // Return empty object in case of error to prevent undefined
  }
}

async function getBalancesHandler(req: any, res: any) {
  try {
    const chain = req?.body.chain || "8453";
    const address =
      req.body.address || "0x30f87e92c06DC163Be8baF686c021a1Bc1FF6618";

    if (!address) {
      return res
        .status(400)
        .json({ error: "Missing required fields, address are required" });
    }

    const url = `https://api.1inch.dev/balance/v1.2/${chain}/balances/${address}`;
    const config = {
      headers: { Authorization: `Bearer ${process.env.ONEINCH_API_KEY}` },
    };

    try {
      // Get balances
      const balancesResponse = await axios.get(url, config);
      const onlyBalances = balancesResponse.data;

      // Get addresses with non-zero balances
      const addresses = Object.entries(onlyBalances)
        .filter(([_, balance]) => balance !== "0")
        .map(([address]) => address);

      console.log("Addresses to fetch:", addresses);

      // Fetch tickers and prices in parallel
      const [tickers, prices] = await Promise.all([
        getTickers(addresses, chain),
        getPrices(addresses, chain),
      ]);

      console.log("Tickers:", tickers);
      console.log("Prices:", prices);

      // Combine all data
      const balances = addresses.map((address) => ({
        address,
        balance: onlyBalances[address],
        price: prices?.[address] || 0,
        ...(tickers?.[address] || {}),
      }));

      return res.status(200).json(balances);
    } catch (error: any) {
      console.error("API Error:", error.response?.data || error.message);
      throw error;
    }
  } catch (error: any) {
    console.error("Error in getBalances Handler:", error.message);
    return res.status(500).json({ error: error.message });
  }
}

export default getBalancesHandler;
