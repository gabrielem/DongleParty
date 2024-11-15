// Auth
import { useAuth } from '@/context/AuthContext';
import React, { ReactNode, useEffect } from 'react';
import Loading from './UI/Loading';
import FormLogin from './FormLogin';

interface AuthProps {
  children: ReactNode;
}

const Auth: React.FC<AuthProps> = ({ children }) => {
  const { 
    user, 
    loading, 
    totpUri,

  } = useAuth();

  useEffect(() => {
    // console.log('-----> totpUri:', totpUri);
    
  } , [totpUri])
  
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
            {!user
                ? <FormLogin />
                : children
            }
        </>
      )}
    </>
  );
};

export default Auth;