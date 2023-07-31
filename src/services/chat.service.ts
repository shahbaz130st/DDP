import { Subject, Subscription } from "rxjs";
import { AuthContextData } from "../models/authContext.model";
import { Chat, ChatMessage } from "../models/chat.model";
import { User } from "../models/user.model";
import { ApiTarget, FetchService } from "./fetch.service";
import { WebSocketAction, WebSocketMessage, WebSocketMessageType, WebSocketService } from "./websocket.service";

const url = '/dm';

export class ChatService {

    private $chatSubject = new Subject<Chat>();

    constructor(private authContext: AuthContextData,
        private fetchService: FetchService, 
        private webSocketService: WebSocketService) { }

    async getChats(): Promise<Chat[]> {
        const userId = this.authContext.authData.userProfile?.user.id;
        const chats = await this.fetchService.get(`${url}/groups/get?user_id=${userId}`);
        return chats.groups?.map((c: any) => ({
            id: c.group_id,
            userIds: JSON.parse(c.user_ids),
        })) ?? [];
    }

    async create(userIds: number[]): Promise<number> {
        const userId = this.authContext.authData.userProfile?.user.id;
        const chat = await this.fetchService.post(`${url}/group/create`, {sender_user_id: userId, user_ids: userIds});
        this.$chatSubject.next(chat);
        return chat.group_id;
    }

    async getMessages(chatId: number, limit: number, page: number): Promise<ChatMessage[]> {
        const userId = this.authContext.authData.userProfile?.user.id;
        const messages: any[] = await this.fetchService.get(`${url}/group/chat/history?sender_user_id=${userId}&group_id=${chatId}&limit=${limit}&page=${page}&order=desc`);
        return messages.map((m: any) => ({
            id: 0,
            chatId: m.group_id,
            userId: m.user_id,
            text: m.message_content,
            createdAt: new Date(`${m.timestamp}Z`)
        }));
    }

    async getFriends(): Promise<Partial<User>[]> {
        const friedsList = await this.fetchService.get(`/chat/friends`, ApiTarget.Backend)
        return friedsList.data.map((u: any) => ({
            id: u.id,
            firstName: u.first_name,
            lastName: u.last_name,
        }));
    }

    async sendMessage(text: string, chatId: number) {
        const message = {
            message: text,
            group_id: chatId
        };
        this.webSocketService.send(WebSocketAction.SendChatMessage, message)
    }

    subscribeToMessages(onMessageReceived: (message: ChatMessage) => void): Subscription {
        return this.webSocketService.$messageSubject.subscribe((message: WebSocketMessage) => {
            if (message.type !== WebSocketMessageType.ChatMessage) return;
            
            const chatMessage: ChatMessage = {
                userId: message.data.user_id,
                chatId: message.data.group_id,
                text: message.data.message_content,
                createdAt: new Date(message.data.timestamp)
            }
            onMessageReceived(chatMessage);
        });
    }

    subscribeToChats(callback: (chat: Chat) => void) {
        return this.$chatSubject.subscribe(callback);
    }

}
