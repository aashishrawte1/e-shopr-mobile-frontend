export interface ChatListItem {
  lastMessage: string;
  timestamp: string;
  type: string;
  key: string;
  chatTitle?: string;
  chatImage?: string;
  receiverUid: string;
  senderUid: string;
}
