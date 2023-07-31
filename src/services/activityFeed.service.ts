import { ApiTarget, FetchService } from "./fetch.service";

export class ActivityFeedService {
    constructor(private fetchService: FetchService) { }

    async get(): Promise<any> {
        const feed_result = await this.fetchService.get(`/activity/list`, ApiTarget.Backend);
        return feed_result.data;
    }
}