import admin from '@/config/firebase-admin'
import NextCors from 'nextjs-cors'
import { NextApiResponse } from 'next'
import { ExtendedNextApiRequest } from '@/modules/_types';

function createHttpError(message: string, status: number) {
    const error = new Error(message);
    (error as any).status = status;
    return error;
}

function getTokenFromHeader(headers: any) {
    const authHeader = headers.authorization;
    console.log('🔑🔑🔑 getTokenFromHeader', authHeader);
    
    if (!authHeader) {
      console.log('Not authenticated. No Auth header', headers)
      throw createHttpError('Not authenticated. No Auth header', 401)
    }
  
    // console.log('🔑🔑🔑 getTokenFromHeader', authHeader);
    const token = authHeader.split(' ')[1]
    if (!token) {
      console.log('Not authenticated. No token', headers)
      throw createHttpError('Not authenticated. No Auth header', 401)
    }
    return token
  }

export async function doAuth(token: string) {
    // console.log('🔑🔑🔑 doAuth'); 
   let decodedToken: any
   try {
     decodedToken = await admin.auth().verifyIdToken(token, true)
     if (!decodedToken.uid) {
       throw createHttpError('Unauthorized', 401)
     }
 
     
     return {
       decodedToken
     }
 
   } catch (error) {
     console.log('🔑🔑🔑 doAuth: error detected!', {token});
     throw error
   }
 }

export function withCors(handler: (req: ExtendedNextApiRequest, res: NextApiResponse) => Promise<void>) {
    return async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
      await NextCors(req, res, {
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        origin: '*',
        optionsSuccessStatus: 200,
      })
  
      return handler(req, res)
    }
}

export function withAuth(handler: (req: ExtendedNextApiRequest, res: NextApiResponse) => Promise<void>, types?: string[]) {
    return async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
      await NextCors(req, res, {
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        origin: '*',
        optionsSuccessStatus: 200,
      })
  
      try {
        const token = getTokenFromHeader(req.headers)
        const { decodedToken } = await doAuth(token)
        // const userRecord = await admin.auth().getUserByEmail(decodedToken?.email);
        // const hasMFA = userRecord?.multiFactor?.enrolledFactors?.length
  
        req.authId = decodedToken.uid
        req.uid = decodedToken.uid
        req.user = decodedToken
        
        const userData = {
          isAdmin: decodedToken.admin || false
        }
        // console.log('🔑🔑🔑 withAuth: userData', userData);
        req.user = userData
      } catch (e) {
        console.log('--> Authentication error <--');
        console.log(e)
        return res.status(401).send({ error: 'Not Authorized!' })
      }
  
      return handler(req, res)
    }
  }