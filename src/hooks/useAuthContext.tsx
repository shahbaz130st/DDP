import { useContext } from 'react';
import { AuthContext } from '../components/authContextProvider';
import { AuthContextData } from '../models/authContext.model';

export const useAuthContext = (): AuthContextData => {
  const context = useContext<AuthContextData>(AuthContext);

  if (!context) {
    throw new Error('useAuthContext must be used within an AuthContextProvider');
  }

  return context;
}
