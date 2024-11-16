import admin from '@/config/firebase-admin'

import { withAuth } from "@/middlewares/middleware";

async function setChallengeHandler(req: any, res: any) {
  console.log('--> setChallengeHandler');
  
  try {

    const challenge = req.body
    const result = await admin.database().ref(`challenges/lists/`).push(challenge)

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in set Challenge Handler:', error);
    return res.status(500).json({ error });
  }
}

export default withAuth(setChallengeHandler)