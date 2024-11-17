import admin from '@/config/firebase-admin'

import { withAuth } from "@/middlewares/middleware";

async function getChallengesHandler(req: any, res: any) {
  try {
    let result = (await admin.database().ref(`challenges/lists`).once('value')).val()
    // console.log('🔑🔑🔑 getChallengesHandler', {challenges: result});
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in get Challenges Handler:', error);
    return res.status(500).json({ error });
  }
}

export default withAuth(getChallengesHandler)