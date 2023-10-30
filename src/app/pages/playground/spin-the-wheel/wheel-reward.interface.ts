export interface SpinWheelReward {
  text: string;
  tags?: Tags;
  table?: Table;
  action: string;
}
export interface Tags {
  [key: string]: boolean;
}
export interface Table {
  [key: string]: boolean;
}
