export interface IMessage {
  description: string;
  name: string;
  timestamp: number;
  senderUid: string;
  receiverUid: string;
  displayTime?: string;
}
