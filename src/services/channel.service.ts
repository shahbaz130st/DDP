import { AuthContextData } from "../models/authContext.model";
import { Channel } from "../models/channel.model"
import { FetchService } from "./fetch.service"
import { Alert } from 'react-native';

const channelUrl: string = '/channel'
const streamUrl: string = '/streams'

export class ChannelService {

    constructor(private authContext: AuthContextData, private fetchService: FetchService) { }

    async getUserChannel(): Promise<Channel> {
        if (!this.authContext.authData.userProfile) throw 'forbidden';
        const name = this.authContext.authData.userProfile.user.uuid;
        const channel = await this.fetchService.get(`${channelUrl}/get?name=${name}`);
        if (!channel?.ingest_endpoint) throw "channel not found";

        return {
            id: '',
            userId: '',
            channelName: channel.channel_name,
            ingestEndpoint: channel.ingest_endpoint,
            playbackUrl: channel.playback_url,
            streamKey: channel.stream_key,
            live: false
        };
    }

    async getLive(): Promise<Channel[]> {
        const channels: any[] = await this.fetchService.get(`${streamUrl}/live`);
        if (!channels) return [];
        return channels.map(c => ({
            id: '',
            userId: '',
            channelName: c.channel_name,
            streamKey: '',
            ingestEndpoint: '',
            playbackUrl: c.playback_url,
            live: true
        }));
    }

    async createUserChannel(): Promise<Channel> {
        if (!this.authContext.authData.userProfile) throw 'forbidden';
        const name = this.authContext.authData.userProfile.user.uuid;
        const id = this.authContext.authData.userProfile.user.id;
        const channel = await this.fetchService.post(`${channelUrl}/create`, { channel_name: name, user_id: id });
        if (!channel?.ingest_endpoint) throw 'channel creation failed';
        return {
            id: '', 
            userId: '', 
            channelName: name,
            ingestEndpoint: channel.ingest_endpoint,
            playbackUrl: channel.playback_url,
            streamKey: channel.stream_key,
            live: false 
        };
    }

    async streamInfo({channel_name, title, description}:{ channel_name: string, title: string, description: string }): Promise<any> {
        if (!this.authContext.authData.userProfile) throw 'forbidden';
        const id = this.authContext.authData.userProfile.user.id;
        const channel = await this.fetchService.post(`/stream/info`, { "channel_name": channel_name, "user_id": id, "title": title, "description": description });
    }
}