'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  TwitterAuthProvider,
} from 'firebase/auth'
import { app } from '@/config/firebase'
import Loading from '@/components/UI/Loading';
import Auth from '@/components/Auth';

const googleProvider = new GoogleAuthProvider()
const twitterProvider = new TwitterAuthProvider()

export const AuthContext = createContext({})
export const useAuth = () => useContext(AuthContext) as any

export const AuthContextProvider = ({
  children
}: any) => {
  const [user, setUser] = useState<any>()
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(true)
  const [admin, setAdmin] = useState(false)
  
  const getToken = async () => {
    const auth = getAuth(app)
    const currentUser = auth.currentUser
    if (currentUser) {
      try {
        const token = await currentUser.getIdToken(true)
        setToken(token)
        return token
      } catch (error) {
        console.log({ error })
        return { error }
      }
    }
  }

  
  const getUser = async () => {
    setLoading(true)
    let u = await getAuth(app).currentUser
    setUser(u || null)
    setLoading(false)
    return u || null
  }
  const signinWithProvider = async (provider: GoogleAuthProvider | TwitterAuthProvider) => {
    setLoading(true)
    try {
      const auth = getAuth()
      const result = await signInWithPopup(auth, provider)
      console.log('-->signinWithProvider', { result });
      
      await getUser()
      return { user: result.user }
    } catch (error) {
      console.log('-->signinWithProvider', { error });
      
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signinTwitter = () => signinWithProvider(twitterProvider)

  const signin = async (email: string, password: string) => {
    const authentication = getAuth(app)
    try {
      const result = await signInWithEmailAndPassword(authentication, email, password)
      await getUser()
      return result
    } catch (error) {
      console.log({ error })
      throw error
    }
  }

  
  const signup = async (email: string, password: string) => {
    const authentication = getAuth(app)
    try {
      const result = await createUserWithEmailAndPassword(authentication, email, password)
      await getUser()
      return result
    } catch (error) {
      console.log({ error })
      throw error
    }
  }

  const forgotPass = async (email: string) => {
    const authentication = getAuth(app)
    try {
      const result = await sendPasswordResetEmail(authentication, email)
      return result
    } catch (error) {
      console.log({ error })
      throw error
    }
  }

  const logout = async () => {
    const authentication = getAuth(app)
    return await signOut(authentication).then(() => {
      setUser(null)
      setAdmin(false)
    })
  }

  const signinGoogle = async () => {
    setLoading(true)
    try {
      const auth = getAuth()
      const user = await signInWithPopup(auth, googleProvider)
      return { user }
    } catch (error) {
      return { error }
    } finally {
      setLoading(false)
    }
  }

  
  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        getToken()
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [])

  useEffect(() => {
    const tokenRefreshInterval = setInterval(() => {
      getToken()
      // console.log("REFRESHING TOKEN")
    }, 30 * 60 * 1000)
    return () => clearInterval(tokenRefreshInterval)
  }, [])

  useEffect(() => {
    const handleStatusChange = () => {
      getToken()
    }
    window.addEventListener("online", handleStatusChange)
    return () => { window.removeEventListener("online", handleStatusChange)}
  }, [])

  useEffect(() => {
    const authentication = getAuth(app)
    const unsubscribe = onAuthStateChanged(authentication, async (authUser: any) => {
      if (authUser) {
        await getUser();
        const idTokenResult = await authUser.getIdTokenResult();
        const admin = idTokenResult.claims.admin || false;
        setAdmin(admin);
      } 
      setLoading(false);
    });
    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signin,
        signup,
        signinGoogle,
        logout,
        forgotPass,
        signinTwitter,
        getUser,
        getToken,
        token,
        admin,
      }}
      ><Auth>
        {loading ? <Loading /> : children}
      </Auth>
    </AuthContext.Provider>
  )
}
