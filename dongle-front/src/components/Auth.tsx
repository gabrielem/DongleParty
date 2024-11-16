// Auth
import { useAuth } from '@/context/AuthContext';
import React, { ReactNode } from 'react';
import Loading from './UI/Loading';
// import FormLogin from './FormLogin';
import TwitterLogin from './TwitterLogin';

interface AuthProps {
  children: ReactNode;
}

const Auth: React.FC<AuthProps> = ({ children }) => {
  const { 
    user, 
    loading, 
  } = useAuth();

  // console.log('user:', user);
  
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
            {!user
                ? <TwitterLogin />
                : children
            }
        </>
      )}
    </>
  );
};

export default Auth;