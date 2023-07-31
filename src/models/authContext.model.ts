import { LoginResponse, UserProfile } from "./user.model";

export interface AuthData {
    authToken?: string;
    userProfile?: UserProfile;
}

export interface AuthContextData {
    authData: AuthData;
    isAuthenticated: boolean;
    isLoggedOut: boolean;
    login: (loginResponse: LoginResponse) => void;
    logout: () => void;
}