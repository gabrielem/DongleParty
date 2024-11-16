// const axios = require("axios");

// async function httpCall() {

//   const url = "https://api.1inch.dev/token/v1.2/1/custom";

//   const config = {
//       headers: {
//   "Authorization": "Bearer aaa"
// },
//       params: {}, paramsSerializer: { indexes: null }
//   };
  

//   try {
//     const response = await axios.get(url, config);
//     console.log(response.data);
//   } catch (error) {
//     console.error(error);
//   }
// }

// getBalances.ts
import axios from "axios";


async function getPrices(addresses: any, chain: any) {

  const url = "https://api.1inch.dev/price/v1.1/" + chain + "";

  const config = {
      headers: {
  "Authorization": "Bearer ZdfoEjBY1xNnZw5z3zG9vz9HmyhUht03"
},
      params: {
  "currency": "USD",
  addresses
},
      paramsSerializer: {
        indexes: null
      }
  };
  

  try {
    const response = await axios.get(url, config);
    // console.log(response.data);
    return response.data

  } catch (error) {
    console.error(error);
  }
}

async function getTickers(addresses: any, chain: any) {

  const url = "https://api.1inch.dev/token/v1.2/" + chain + "/custom";

  const config = {
      headers: {
  "Authorization": "Bearer " + process.env.ONEINCH_API_KEY
},
      params: {
  "addresses": addresses
},
      paramsSerializer: {
        indexes: null
      }
  };
  

  try {
    const response = await axios.get(url, config);
    console.log(response.data);
    return response.data

  } catch (error) {
    console.error(error);
  }
}


async function getBalancesHandler(req: any, res: any) {
  try {

    // arbitrum: 42161; || base: 8453
    const chain = req?.body.chain || '8453';
    //const address = req?.body?.address
    // const chain = req.query.chain || '42161';
    const address = req.body.address || '0x30f87e92c06DC163Be8baF686c021a1Bc1FF6618'

    if (!address) {
        return res.status(400).json({ error: 'Missing required fields, address are required' });
    }
    

    const url = `https://api.1inch.dev/balance/v1.2/${chain}/balances/${address}`;
    const config = {
      headers: { "Authorization": "Bearer " + process.env.ONEINCH_API_KEY },
      params: {},
      paramsSerializer: { indexes: null }
    };

    try {
        const response = await axios.get(url, config);
        console.log('response.data', response.data);
        const onlyBalances = response.data
        let addresses = []
        for (const key in onlyBalances) {
          if (onlyBalances.hasOwnProperty(key)) { 
            console.log(`Indirizzo: ${key}, Valore: ${onlyBalances[key]}`);
            addresses.push(key)
          }
        }

        
        console.log('addresses', addresses);
        const tikers = await getTickers(addresses, chain) as any
        console.log('tikers:', tikers);

        const prices = await getPrices(addresses, chain) as any
        console.log('--prices:', prices);

        let balances = []
        for (const key in tikers) {
          if (tikers.hasOwnProperty(key)) { 
            balances.push({
              address: key, 
              balance: onlyBalances[key], 
              // price: prices[key], 
              ...tikers[key]
            })

          }
        }

        

        // https://portal.1inch.dev/documentation/apis/tokens/swagger?method=get&path=%2Fv1.2%2F%7BchainId%7D%2Fcustom


        return res.status(200).json(balances);
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