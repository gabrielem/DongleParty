import admin from '@/config/firebase-admin';
import { withAuth } from "@/middlewares/middleware";
import axios from 'axios';

async function getWalletHandler(req: any, res: any) {
  console.log('--> getWalletHandler');
  
  try {
    const uid = req.uid;
    const result = (await admin.database().ref(`wallet/user_id/${uid}`).once('value')).val();
    let wallet_address = result?.wallet?.default_address_id;
    console.log('🔑🔑🔑 getWalletHandler', { wallet_address });

    if (!wallet_address) {
      try {
        const response = await axios.post(`https://donglellmapi.onrender.com/user/${uid}/create_wallet`, {}, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('🔑🔑🔑 getWalletHandler', { response: response.data });

        wallet_address = response.data.wallet_address; // Assumi che l'API restituisca questo campo
        console.log('✅ Nuovo wallet creato:', wallet_address);
      } catch (apiError: any) {
        console.error('Error creating wallet:', apiError.message);
        return res.status(503).json({ error: 'Servizio wallet temporaneamente non disponibile' });
      }
    }

    const challengeId = (await admin.database().ref(`challenges/participants/users/${uid}`).once('value')).val()

    return res.status(200).json({ wallet_address, challengeId });
  } catch (error) {
    console.error('Error in get Wallet Handler:', error);
    return res.status(500).json({ error: 'Errore interno del server' });
  }
}

export default withAuth(getWalletHandler);
