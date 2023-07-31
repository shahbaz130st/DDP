import React, { Dispatch, SetStateAction, createContext } from 'react';

export const LoadingContext = createContext<Dispatch<SetStateAction<boolean>>>(() => {});

interface LoadingContextProviderProps {
    setLoading: Dispatch<SetStateAction<boolean>>;
    children: any;
}

export const LoadingContextProvider = ({ children, setLoading }: LoadingContextProviderProps) => {
    return (
        <LoadingContext.Provider value={setLoading}>
            { children }
        </LoadingContext.Provider>
    );
}
