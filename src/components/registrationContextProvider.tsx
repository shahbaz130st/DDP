import React, { createContext, useState } from 'react';
import { IdentityData, LicenseData, RegistrationContextData, RegistrationData, VerificationData } from '../models/registrationContext.model';

export const RegistrationContext = createContext<RegistrationContextData>({} as RegistrationContextData);

interface RegistrationContextProviderProps {
  children: any
}

export const RegistrationContextProvider = ({ children }: RegistrationContextProviderProps) => {
    const [registrationData, setRegistrationData] = useState<RegistrationData>({});
    const [verificationData, setVerificationData] = useState<VerificationData>({});
    const [identityData, setIdentityData] = useState<IdentityData>({});
    const [identityDocument, setIdentityDocument] = useState('');
    const [licenseData, setLicenseData] = useState<LicenseData>({});
    const [licenseDocument, setLicenseDocument] = useState('');

    const context: RegistrationContextData = { 
        registrationData,
        setRegistrationData, 
        verificationData,
        setVerificationData,
        identityData,
        setIdentityData,
        identityDocument,
        setIdentityDocument,
        licenseData,
        setLicenseData,
        licenseDocument,
        setLicenseDocument
    }

    return (
        <RegistrationContext.Provider value={context}>
            { children }
        </RegistrationContext.Provider>
    );
}
