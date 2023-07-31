export interface RegistrationContextData {
    registrationData: RegistrationData, 
    setRegistrationData: React.Dispatch<React.SetStateAction<RegistrationData>>, 
    verificationData: VerificationData,
    setVerificationData: any,
    identityData: IdentityData,
    setIdentityData: any,
    identityDocument: string,
    setIdentityDocument: any,
    licenseData: LicenseData,
    setLicenseData: any,
    licenseDocument: string,
    setLicenseDocument: any;
}

export interface RegistrationData {
    email?: string,
    confirmEmail?: string,
    password?: string
    confirmPassword?: string
}

export interface VerificationData {
    email?: string,
    phoneNumber?: string,
    password?: string
}

export interface IdentityData {
    firstName?: string,
    lastName?: string,
    dateOfBirth?: string,
    stateOfLicense?: string,
}

export interface LicenseData {
    firstName?: string,
    lastName?: string,
    licensePermitNumber?: string,
    licenseType?: string,
    boardAction?: string,
    city?: string,
    stateOfLicense?: string;
    npiNumber?: string;
}