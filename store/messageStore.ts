import { NotificationItem } from "@/interfaces/apiTypes";
import { create } from "zustand";
interface MessageStore {
    isLoading: boolean;
    messageList: NotificationItem[];
    addMessages: (messages: NotificationItem[]) => void;
    clearMessages: () => void;
}
export const useMessageStore = create<MessageStore>((set, get) => ({
    isLoading: false,
    messageList: [],
    addMessages: (messages) => {
        if (!messages || messages.length === 0) return;
        const currentMessageList = get().messageList;
        const newMessageList = messages.filter(
            (newMessage: NotificationItem) =>
                !currentMessageList.some(
                    (existingMessage) => existingMessage.id === newMessage.id
                )
        );
        set({ messageList: [...currentMessageList, ...newMessageList] });
    },
    clearMessages: () => {
        set({ messageList: [] });
    },
}))