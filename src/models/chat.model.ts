export interface Chat {
    id: number;
    userIds: number[]
    createdAt: Date;
}

export interface ChatMessage {
    id?: number;
    chatId: number;
    userId: number;
    text?: string;
    createdAt: Date;
}
