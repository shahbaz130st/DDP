import { IdentityLicense, MedicalLicense } from "./license.model";

export interface UserProfile {
    user: User
    identityLicense?: IdentityLicense;
    medicalLicense?: MedicalLicense;
}

export interface User {
    id: number;
    uuid: string;
    email: string;
    emailVerified: boolean;
    phoneNumber: string;
    phoneVerified: boolean;
    profileImage?: string;
    firstName?: string;
    lastName?: string;
}

export interface LoginResponse {
    userProfile?: UserProfile;
    authToken: string;
}