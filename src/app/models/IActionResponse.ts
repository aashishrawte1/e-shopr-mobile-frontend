import { ApiResponse, Statistics } from '.';

export interface IActionResponse extends ApiResponse {
  result: Result;
}
export interface Result {
  points: Points;
  rewarded?: boolean;
  statistics: Statistics;
}
export interface Points {
  added: string;
  total: string;
}
