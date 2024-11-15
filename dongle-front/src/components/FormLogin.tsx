// FormLogin
'use client'

import Button from "@/components/UI/Button"
import { useAuth } from "@/context/AuthContext"
import { IFormLogin } from "@/modules/_types"
import { validateEmail } from "@/utils/utils"
import Image from "next/image"
import Link from "next/link"
import { ChangeEvent, useEffect, useRef, useState } from "react"


const FormLogin = () => {
  const { signin, forgotPass } = useAuth()
  
  const [formAuth, setFormAuth] = useState<IFormLogin>({
    email: '',
    password: ''
  })
  const [isRecovery, setIsRecovery] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const firstInputRef = useRef<HTMLInputElement | null>(null);

  const focusOnFirstInput = () => {
    if (firstInputRef.current) firstInputRef.current.focus()
  }
  useEffect(() => { focusOnFirstInput() }, [])
  
  const handleSetFormAuth = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormAuth({ ...formAuth, [name]: value })
  }

  const handleSetRecovery = () => {
    setIsRecovery(!isRecovery)
  }



  const doRecovery = async () => {
    setIsLoading(true)
    try {
      await forgotPass({ email: formAuth.email })
      setFormAuth({email: '', password: ''})
    } catch (error) {
      console.log('error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const doLogin = async () => {
    setIsLoading(true)
    try {
      await signin({ email: formAuth.email, password: formAuth.password })
    } catch (error) {
      console.log('error:', error);
      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    const emailError = validateEmail(formAuth.email)
    if (emailError) console.log('emailError:', emailError);
    if(!isRecovery) { await doLogin() } else { await doRecovery() }
  }



  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage: "url(/bg-home.png)",
      }}>

      <div className="hero-content bg-black bg-opacity-70 text-white rounded-md text-center">
        <div className="w-72 lg:w-96 lg:p-5">
          <div className="flex flex-col">
            <div className="flex justify-center">
              <Link href="/"><Image src='/dongle-logo-white.png' height={60} width={300} alt='Dongle' /></Link>
            </div>
            <div>
              <div>
                <div className="form-control mt-4">
                  <input 
                    name="email"
                    type="email" 
                    placeholder="Email" 
                    className="input input-bordered bg-white text-black" 
                    value={formAuth.email}
                    onChange={handleSetFormAuth}
                    required 
                    ref={firstInputRef}
                  />
                </div>
               {!isRecovery && <div className="form-control mt-4">
                  <input 
                    name="password"
                    type="password" 
                    placeholder="Password" 
                    className="input input-bordered bg-white text-black" 
                    value={formAuth.password}
                    onChange={handleSetFormAuth}
                    required 
                  />
                </div>}
                <div className="form-control mt-4">
                  <Button 
                    loading={isLoading}
                    onClick={handleSubmit}
                  >
                    {!isRecovery ? 'ACCEDI' : 'INVIA'}
                  </Button>
                </div>
                <div className="mt-6">
                  <label>
                    <Link 
                      href="" 
                      className="text-white text-base label-text-alt link link-hover"
                      onClick={handleSetRecovery}
                    >
                      {!isRecovery ? 'Recupero password?' : 'Torna al Login'}
                    </Link>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormLogin