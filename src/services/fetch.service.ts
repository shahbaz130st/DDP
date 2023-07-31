import { Config } from "../config/config"
import { AuthContextData } from "../models/authContext.model";
import { log } from "../utils/log";

export class FetchService {
    constructor(private authContext: AuthContextData) {}

    public async get(url: string, target: ApiTarget = ApiTarget.Serverless) {
        const baseUrl = this.getBaseUrl(target);
        return this.request(`${baseUrl}${url}`, FetchMethod.GET);
    }

    public async post(url: string, body: any, target: ApiTarget = ApiTarget.Serverless, headers: any = {}) {
        const baseUrl = this.getBaseUrl(target);
        return this.request(`${baseUrl}${url}`, FetchMethod.POST, body, headers)
    }

    public async patch(url: string, body: any, target: ApiTarget = ApiTarget.Serverless) {
        const baseUrl = this.getBaseUrl(target);
        return this.request(`${baseUrl}${url}`, FetchMethod.PATCH, body)
    }

    private getBaseUrl(target: ApiTarget): string {
        return target == ApiTarget.Serverless
            ? Config.BASE_URL
            : Config.API_URL; 
    }

    private async request(url: string, method: FetchMethod, body?: any, headers: any = {}): Promise<any> {
        const bodyIsJson: boolean = !!body && !(body instanceof FormData);
        if (bodyIsJson) body = JSON.stringify(body);
        log(`${method}: ${url} ${body ? ',' + body : '' }`.substring(0, 1000));

        const reqHeaders = {
            ...this.getHeaders(body),
            ...headers
        }
        const res = await fetch(url, { method, body, headers: reqHeaders });
        if (!res.ok) {
            let message = res.statusText;
            try {
                message = await res.json();
            } catch(e) {
                console.log(e);
            }
            log(`${res.status}: ${url}: ${message ? JSON.stringify(message) : ''}`);
            if (res.status === 403) this.authContext.logout();
            if (res.status === 400) throw new FetchError(res.statusText ?? 'Failed', res.status, message);
            throw new FetchError(res.statusText ?? 'Failed', res.status);
        }

        const resJson = await res.json();
        log(`${res.status}: ${url}: ${JSON.stringify(resJson)}`.substring(0, 1000));
        return resJson;
    }

    private getHeaders(body: any): {[key: string]: string} {
        const contentType = !!body && body instanceof FormData
            ? 'multipart/form-data'
            : 'application/json';

        const headers: {[key: string]: string} =  {
            'Content-Type': contentType, 
        };
        
        if (this.authContext.authData.authToken) headers['X-CSRFToken'] = this.authContext.authData.authToken;
        if (this.authContext.authData.authToken) headers['Referer'] = Config.API_URL;
        return headers;
    }
}

export enum FetchMethod {
    GET = 'GET',
    POST = 'POST',
    PATCH = 'PATCH'
}

export enum ApiTarget {
    Backend = 'backend',
    Serverless = 'serverless'
}

export enum ErrorStatus {
    BadRequest = 400,
    Unauthorized = 401,
    NotFound = 404,
    ServerError = 500
};


export class FetchError extends Error {
    constructor(message: string, public status: number, public data?: any) {
        super(message);
    }
}