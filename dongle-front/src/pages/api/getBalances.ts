// getBalances.ts
import { withAuth } from "@/middlewares/middleware";
import axios from "axios";

async function getBalancesHandler(req: any, res: any) {
  try {

    // arbitrum: 42161; || base: 8453

    const {chain, address} = req?.body 
    const url = `https://api.1inch.dev/balance/v1.2/${chain}/balances/${address}`;
    const config = {
      headers: { "Authorization": "Bearer " + process.env.ONEINCH_API_KEY },
      params: {},
      paramsSerializer: { indexes: null }
    };


    try {
        const response = await axios.get(url, config);
        console.log(response.data);
        return res.status(200).json(response.data);
    } catch (error) {
        console.error(error);
        throw error;
    }
    
  } catch (error) {
    console.error('Error in get Property Handler:', error);
    return res.status(500).json({ error });
  }
}

export default withAuth(getBalancesHandler)