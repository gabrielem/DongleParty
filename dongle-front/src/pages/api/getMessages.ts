import admin from '@/config/firebase-admin'
import { withAuth } from "@/middlewares/middleware";

async function getMessagesHandler(req: any, res: any) {
  try {
    const uid = req.uid;
    const challengeId = req?.body?.challengeId

    if (!challengeId) throw "Challenge ID not found"

    const response = (await admin.database().ref(`challenges/lists/${challengeId}/participants/${uid}/messages`).once('value')).val();

    return res.status(200).json({ messages: Object.values(response) });
  } catch (error) {
    console.error('Error in get Property Handler:', error);
    return res.status(500).json({ error });
  }
}

export default withAuth(getMessagesHandler)