import { Dispatch, SetStateAction, useContext } from 'react';
import { LoadingContext } from '../components/loadingContextProvider';


export const useLoading = (): Dispatch<SetStateAction<boolean>> => {
  const setLoading = useContext<Dispatch<SetStateAction<boolean>>>(LoadingContext);

  if (!setLoading) {
    throw new Error('useLoading must be used within an LoadingContextProvider');
  }

  return setLoading;
}
