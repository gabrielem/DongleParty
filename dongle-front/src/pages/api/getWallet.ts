import admin from '@/config/firebase-admin'
import { withAuth } from "@/middlewares/middleware";

async function getWalletHandler(req: any, res: any) {
  console.log('--> getWalletHandler');
  
  try {
    const uid = req.uid
    const result = (await admin.database().ref(`wallet/user_id/${uid}`).once('value')).val()
    let wallet_address = result?.wallet?.default_address_id
    console.log('🔑🔑🔑 getWalletHandler', {wallet_address});

    if (!wallet_address) {
      try {
        const response = await fetch('https://donglellmapi.onrender.com/user/l089ashd9hiubfa8shf/create_wallet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
        });

        console.log('🔑🔑🔑 getWalletHandler', {response});

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        wallet_address = data.wallet_address; // assumi che l'API restituisca questo campo
        console.log('✅ Nuovo wallet creato:', wallet_address);
      } catch (apiError) {
        console.error('Error creating wallet:', apiError);
        return res.status(503).json({ error: 'Servizio wallet temporaneamente non disponibile' });
      }
    }

    return res.status(200).json({ wallet_address });
  } catch (error) {
    console.error('Error in get Wallet Handler:', error);
    return res.status(500).json({ error });
  }
}

export default withAuth(getWalletHandler)