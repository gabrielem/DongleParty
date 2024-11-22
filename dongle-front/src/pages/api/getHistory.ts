// getHistory.ts
import { withAuth } from "@/middlewares/middleware";
import axios from "axios";
import { rateLimiter } from '@/utils/rateLimiter';

async function getHistoryHandler(req: any, res: any) {
  try {
    const { wallet } = req?.body;
    if (!wallet) {
      return res.status(400).json({ 
        error: 'Missing required fields, wallet are required' 
      });
    }
    
    const BASE_URL = "https://api.1inch.dev/history/v2.0/history";
    const url = `${BASE_URL}/${wallet}/events?chainId=${8453}&limit=${10}`;
    const config = {
      headers: { 
        "Authorization": "Bearer " + process.env.ONEINCH_API_KEY 
      }
    };

    try {
      // Wrap the API call with the rate limiter
      const response = await rateLimiter.enqueue(async () => {
        return axios.get(url, config);
      });
      
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

export default withAuth(getHistoryHandler);
