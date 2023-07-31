import { AuthContextData } from "../models/authContext.model";
import { ApiTarget, FetchService } from "./fetch.service"
import fs from 'react-native-fs';

const url: string = '/upload'
const chunkSize: number =  2 * 1024 * 1024;
export class UploadService {
    constructor(private authContext: AuthContextData, private fetchService: FetchService) { }

    async uploadFile(
        title: string = '',
        content: string = '',
        filePath: string, 
        uploadType: 'video' | 'image',
        onUploadProgress: (percentage: number) => void,
        imageType?: 'SIL' | 'ML' | 'profile-image'
    ): Promise<void> {
        const fileSize = (await fs.stat(filePath)).size;
        // fix this is quick and dirty
        let requestData: any = {};
        if (uploadType == 'video') {
            requestData = {
                "title": `${title}`,
                "content": `${content}`,
                "filename": `${title}.mp4`,
                "total_size": `${fileSize}`,
                "chunk_size": `${chunkSize}`,
                "total_chunks": `${Math.ceil(fileSize / chunkSize)}`,
                "chunk_number": '1', // changes to 2 for second chunk
                "uuid": `${this.authContext.authData.userProfile?.user.uuid}`,
                "preflight": "1", // changes to 1 after preflight
                "upload_type": uploadType,
                "user_id": `${this.authContext.authData.userProfile?.user.id}`,
            }
        } else {
            // file path is last item in array after splitting on /
            let fileArray = filePath.split('/');
            let fileName = fileArray[fileArray.length - 1];

            requestData = {
                "filename": `${fileName}`,
                "total_size": `${fileSize}`,
                "chunk_size": `${chunkSize}`,
                "total_chunks": `${Math.ceil(fileSize / chunkSize)}`,
                "chunk_number": '1', // changes to 2 for second chunk
                "uuid": `${this.authContext.authData.userProfile?.user.uuid}`,
                "preflight": "1", // changes to 0 after preflight
                "upload_type": `image`,
                "user_id": `${this.authContext.authData.userProfile?.user.id}`,
                "image_type": imageType
            }
        }


        let assetId = '';
        let uniqueToken = '';
        let chunkNum= 0;
        // Send the chunks to the uploader
        for (let offset = 0; offset < fileSize; offset += chunkSize) {
            const chunkSizeToRead = Math.min(chunkSize, fileSize - offset);
            const chunk = await fs.read(filePath, chunkSizeToRead, offset, 'base64');
            if (chunkNum == 0) {
                requestData['preflight'] = '1';
                const result = await this.initializeUpload(requestData);
                // TODO: need better error handling here
                assetId = result.assetId;
                uniqueToken = result.uniqueToken;
            }
            requestData['chunk_number'] = `${chunkNum+1}`;
            requestData['preflight'] = '0';
            requestData['asset_id'] = assetId;
            requestData['unique_token'] = uniqueToken;
            await this.sendChunk(chunk, requestData);

            const percentage = Math.round(((offset + chunkSize) / fileSize) * 100);
            onUploadProgress(percentage > 100 ? 100 : percentage);
            chunkNum++;
        }
        
        return;
    }

    private async initializeUpload(requestData: any): Promise<{uniqueToken: string; assetId: string;}> {  
        const result = await this.fetchService.post(url, requestData, ApiTarget.Serverless)
        return {
            uniqueToken: result.unique_token,
            assetId: result.asset_id
        }
    }

    private async sendChunk(chunk: string, requestData: any) {
        const headers = {
        };
        const formData = new FormData();
        Object.keys(requestData).forEach(key => {
            formData.append(key, requestData[key]);
        });

        formData.append('file', chunk);
        const result = await this.fetchService.post(url, formData, ApiTarget.Serverless, headers);
        return result.status == 200;
    } 
}