import { ChatContent } from "./chat-content";

export interface ClientChatContent extends ChatContent {
    loading?: boolean;
    imagePreview?: string;
}