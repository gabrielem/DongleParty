// getBalances.ts
import axios from "axios";

async function getBalancesHandler(req: any, res: any) {
  try {

    // arbitrum: 42161; || base: 8453

    const {chain, address} = req?.body 
    if (!chain || !address) {
        return res.status(400).json({ error: 'Missing required fields, chain, and address are required' });
    }
    // const chain = req.query.chain || '42161';
    // const address = req.query.address || '0xFB3bc2F5EDB94516BcbFaD47931BF04a057d0e70'

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

export default getBalancesHandler