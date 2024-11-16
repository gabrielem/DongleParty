// setMessage
import admin from '@/config/firebase-admin'
import { withAuth } from "@/middlewares/middleware";
import axios from "axios";

async function setMessageHandler(req: any, res: any) {
  try {
    const uid = req.uid;
    const message = req?.body?.message
    const challengeId = req?.body?.challengeId

    if(!message) throw "Message not found"
    if(!challengeId) throw "Challenge ID not found"
    
    
    console.log('🔑🔑🔑 setMessageHandler', { uid, message });
    
    const response = await axios.post(`https://donglellmapi.onrender.com/user/${uid}/message`, {
        message: message.message
    }, { headers: { 'Content-Type': 'application/json', } });
    
    console.log('🔑🔑🔑 setMessageHandler RESPOSNE:', response.data);

    // await admin.database().ref(`challenges/lists/${challengeId}/participants/${uid}/messages`).push(message)
    // await admin.database().ref(`challenges/lists/${challengeId}/participants/${uid}/messages`).push({
    //     bot: true, message: response.data, date: Date.now()
    // })
    await admin.database().ref(`challenges/lists/${challengeId}/participants/${uid}/messages`).update({
        [admin.database().ref().push().key as string]: message,
        [admin.database().ref().push().key as string]: {
            bot: true,
            message: response.data,
            date: Date.now()
        }
    });
    
    
    

    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error in get Property Handler:', error);
    return res.status(500).json({ error });
  }
}

export default withAuth(setMessageHandler)