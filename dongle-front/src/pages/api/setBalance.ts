// setBalance
import admin from '@/config/firebase-admin'

import { withAuth } from "@/middlewares/middleware";

async function setBalanceHandler(req: any, res: any) {
  console.log('--> setChallengeHandler');
  
  try {
    const uid = req?.uid
    const challengeId = req.body
    const balance = req.body
    const result = await admin.database().ref(`challenges/lists/${challengeId}/participants/${uid}/balance`).set(balance)
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in set Challenge Handler:', error);
    return res.status(500).json({ error });
  }
}

export default withAuth(setBalanceHandler)