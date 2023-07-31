import { Platform } from "react-native";
import { Config } from "../config/config";
import { IdentityLicense, LicenseType, MedicalLicense } from "../models/license.model";
import { LoginResponse, UserProfile } from "../models/user.model";
import { log } from "../utils/log";
import { ApiTarget, FetchError, FetchMethod, FetchService } from "./fetch.service";
import cookie from 'cookie';
import fs from 'react-native-fs';

const authUrl: string = '/auth'
const profileUrl: string = '/profile'

export class AuthenticationService {
    static readonly OtpCodeLength: number = 6;

    constructor(private fetchService: FetchService) { }

    async login(email: string, password: string, registration?: boolean): Promise<LoginResponse> {
        const url = !registration 
            ? `${Config.API_URL}${authUrl}/login`
            : `${Config.API_URL}${authUrl}/register`;
        const body = JSON.stringify({ email, password });
        const method = FetchMethod.POST;
        log(`${method}: ${url} ,${body}`);

        const headers: {[key: string]: string} =  {
            'Content-Type': 'application/json', 
            'X-CSRFToken':  ''
        };
        const res = await fetch(url, { method, body, headers });
        const resJson = await res.json();
        log(`${res.status}: ${url}: ${JSON.stringify(resJson)}`);

        if (!res.ok) {
            const error = !registration
                ? 'Login Failed'
                : 'Registration Failed';
            throw new FetchError(error, res.status);
        }

        let cookieHeaderString = Platform.OS == 'ios' ? 'set-cookie' : 'Set-Cookie';
        const setCookieHeader = res.headers.get(cookieHeaderString);
        if (!setCookieHeader) throw 'login failed. no csrf token found'
        const csrfCookie = cookie.parse(setCookieHeader);
        const csrfToken = csrfCookie.csrftoken

        return { userProfile: resJson.data, authToken: csrfToken};
    }
    
    async logout() {
        const result = await this.fetchService.post(`${authUrl}/logout`, null, ApiTarget.Backend);
    }
    
    async register(email: string, password: string): Promise<LoginResponse> {
        return this.login(email, password, true);
    }

    sendOTP(type: 'email'| 'sms', value: string) {
        this.fetchService.get(`${authUrl}/otp?method_type=${type}&method_value=${value}`, ApiTarget.Backend)
    }

    async verifyOTP(code: string) {
        const result = await this.fetchService.post(`${authUrl}/otp`, { one_time_code: code }, ApiTarget.Backend)
        return result.status == 'success';
    }

    async sendOTPPassword(type: 'email'| 'sms', value: string) {
        const result = await this.fetchService.get(`${authUrl}/otp/resetPassword?method_type=${type}&method_value=${value}`, ApiTarget.Backend)
        return result.status == 'success'
    }

    async verifyOTPPassword(code: string, email: string) {
        const result = await this.fetchService.post(`${authUrl}/otp/resetPassword`, { one_time_code: code, email: email }, ApiTarget.Backend)
        return result.status == 'success';
    }

    async resetPassword(email: string, password: string) {
        const result = await this.fetchService.post(`${authUrl}/resetPassword`, { email: email, password: password }, ApiTarget.Backend)
        return result.data;
    }
    
    async verifyIdentity({firstName, lastName, dateOfBirth, stateOfLicense} : {[key: string]: string}, imagePath?: string) {
        const licenseData: any = {
            'first_name': firstName,
            'last_name': lastName,
            'date_of_birth': dateOfBirth,
            'state_of_license': stateOfLicense,
            'license_type': LicenseType.Identity,
        };
        if (imagePath) licenseData['file'] = await fs.readFile(imagePath, 'base64');
        const result = await this.fetchService.post(`${profileUrl}/license`, licenseData, ApiTarget.Backend);
    }

    async verifyLicense({firstName, lastName, licensePermitNumber, stateOfLicense, state}: {[key: string]: string}) {
        const licenseData = {
            'first_name': firstName,
            'last_name': lastName, 
            'license_number': licensePermitNumber, 
            'license_type':  LicenseType.Medical, 
            'state_of_license': stateOfLicense,
            'state': state
        };
        const result = await this.fetchService.post(`${profileUrl}/license`, licenseData, ApiTarget.Backend);
    }

    async verifyNpiNumber({firstName, lastName, npiNumber, licensePermitNumber}: {[key: string]: string}) {
        const licenseData = {
            'first_name': firstName,
            'last_name': lastName, 
            'npi_number': npiNumber,
            'license_number': licensePermitNumber, 
            'license_type':  LicenseType.Medical, 
        };
        const result = await this.fetchService.post(`${profileUrl}/license`, licenseData, ApiTarget.Backend);
    }
    
    async scanLicense(filePath: string, licenseType: LicenseType): Promise<IdentityLicense | MedicalLicense | null> {
        const file = await fs.readFile(filePath, 'base64');    

        const formData = new FormData();
        formData.append('file', file);
        formData.append('license_type', licenseType);
        const result = await this.fetchService.post(`${profileUrl}/licenseScan`, formData, ApiTarget.Backend, {'Content-Type': 'multipart/form-data'});
        if (!result.data) return null;
        return licenseType === LicenseType.Identity 
            ? {
                firstName: result.data.first_name,
                lastName: result.data.last_name,
                licenseType: LicenseType.Identity,
                dateOfBirth: `${result.data.date_of_birth}`,
                stateOfLicense: result.data.state_of_license,
            }
            : {
                firstName: result.data.first_name,
                lastName: result.data.last_name,
                licenseType: LicenseType.Medical,
                licenseNumber: result.data.license_number,
                title: result.data.licensed_title,
                stateOfLicense: result.data.state_of_license,
                npiNumber: ''
            };
    }

    async getUserProfile(): Promise<UserProfile> {
        const result = await this.fetchService.get(`${profileUrl}`, ApiTarget.Backend)
        return result.data;
    }

}