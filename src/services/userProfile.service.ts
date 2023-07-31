import { ApiTarget, FetchService } from "./fetch.service";
import fs from 'react-native-fs';

const profileUrl: string = '/profile'
export class UserProfileService {
    constructor(private fetchService: FetchService) { }

    async get(userId: number): Promise<any> {
        const feed_result = await this.fetchService.get(`${profileUrl}/user/${userId}`, ApiTarget.Backend);
        return feed_result.data;
    }

    async setProfileImage(filePath: string): Promise<void> {
        const file = await fs.readFile(filePath, 'base64');    
        const formData = new FormData();
        formData.append('file', file);
        await this.fetchService.post(`${profileUrl}/image`, formData, ApiTarget.Backend);
    }
}