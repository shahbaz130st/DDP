import { useContext } from 'react';
import { RegistrationContext } from '../components/registrationContextProvider';
import { RegistrationContextData } from '../models/registrationContext.model';

export const useRegistrationContext = (): RegistrationContextData => {
  const context = useContext<RegistrationContextData>(RegistrationContext);

  if (!context) {
    throw new Error('useRegistrationContext must be used within an RegistrationContextProvider');
  }

  return context;
}
