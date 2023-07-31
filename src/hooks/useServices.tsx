import { useContext } from 'react';
import { Services, ServicesContext } from '../components/servicesContextProvider';

export const useServices = (): Services => {
  const services = useContext<Services>(ServicesContext);

  if (!services) {
    throw new Error('useServices must be used within an ServicesContextProvider');
  }

  return services;
}
