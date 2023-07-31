import { Subject } from "rxjs";
import { Config } from "../config/config";
import { AuthContextData } from "../models/authContext.model";
import { log } from "../utils/log";

const pingInterval = 1000 * 60 * 9;

export class WebSocketService {
    
    private webSocket: WebSocket | undefined;

    public $messageSubject = new Subject<WebSocketMessage>();

    constructor(private authContext: AuthContextData) {
        if (authContext.isAuthenticated) this.openConnection();
    }

    closeConnection() {
        this.webSocket?.close();
    }
    
    send(messageAction: WebSocketAction, data: any) {
        log(`WS: SEND ${JSON.stringify(data)}`);
        const messageData = JSON.stringify({
            action: messageAction,
            ...data
        });
        this.webSocket?.send(messageData);
    }

    subscribeToMessages(callback: (message: WebSocketMessage) => void) {
        return this.$messageSubject.subscribe(callback);
    }

    private openConnection() {
        log(`WS: OPEN`);
        this.webSocket = new WebSocket(`${Config.WS_URL}?user_id=${this.authContext.authData.userProfile?.user.id}`);
        this.webSocket.onopen = () => {
            setInterval(() => this.ping(), pingInterval);
        };
        this.webSocket.onclose = () => {
            log(`WS: CLOSE`);
            if (!this.webSocket) return;
            this.webSocket.onmessage = null;
            this.webSocket.onopen = null;
            this.webSocket.onmessage = null;
        };
        this.webSocket.onmessage = (event: WebSocketMessageEvent) => {
            log(`WS: ${event.data}`);
            const data = JSON.parse(event.data);
            
            // todo correlate this error to outgoing message
            if (data.message === 'Internal server error') return;
            
            // todo determine message type from back end data
            const type = WebSocketMessageType.ChatMessage; // data.message_type

            const message: WebSocketMessage = { type, data }
            this.$messageSubject.next(message)
        };
    }

    private async ping() {
        const data = {
            content: {
                group_id: 0,
                message: ''
            }
        };
        this.send(WebSocketAction.Ping, data)
    }
}

export enum WebSocketAction {
    Ping = 'ping',
    SendChatMessage = 'sendMessage'
}

export enum WebSocketMessageType {
    ChatMessage = 'chat-message'
}

export interface WebSocketMessage {
    type: WebSocketMessageType;
    data: any;
}

