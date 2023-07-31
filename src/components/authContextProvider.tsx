import React, { createContext, useEffect, useState } from 'react';
import { AuthContextData, AuthData } from '../models/authContext.model';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginResponse } from '../models/user.model';

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthContextProviderProps {
  children: any
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [authData, setAuthData] = useState<AuthData>({});

  const isAuthenticated = !!authData.authToken 
    && (!!authData.userProfile?.user.emailVerified || !!authData.userProfile?.user.phoneVerified)
    && !!authData.userProfile?.identityLicense
    && !!authData.userProfile?.medicalLicense;

  const isLoggedOut = !authData.authToken && !authData.userProfile;

  useEffect(() => {
  }, [authData]);

  const login = (loginResponse: LoginResponse) => {
    const { authToken, userProfile } = loginResponse;

    AsyncStorage.setItem('authToken', authToken);
    AsyncStorage.setItem('userUuid', userProfile?.user.uuid ?? '');
    AsyncStorage.setItem('userEmail', userProfile?.user.email ?? '');
    setAuthData({ authToken, userProfile });
  }

  const logout = () => {
    AsyncStorage.removeItem('authToken');
    AsyncStorage.removeItem('userUuid');
    setAuthData({});
  }

  return (
    <AuthContext.Provider value={ { authData, isAuthenticated, isLoggedOut, login, logout }}>
      { children }
    </AuthContext.Provider>
  );
}
