
export enum LicenseType {
    Identity = 'SIL',
    Medical = 'ML'
}

export interface IdentityLicense {
    firstName: string;
    lastName: string;
    licenseType: LicenseType.Identity;
    dateOfBirth: string;
    stateOfLicense: string;
}

export interface MedicalLicense {
    firstName: string;
    lastName: string;
    licenseType: LicenseType.Medical;
    licenseNumber: string;
    title: string;
    npiNumber: string;
    city?: string;
    stateOfLicense?: string;
}