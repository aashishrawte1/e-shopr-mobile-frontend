import { ApiResponse } from '.';

export interface IGetQuizResponse extends ApiResponse {
  result: IQuizResult[];
}
export interface IQuizResult {
  uniqueId: string;
  options?: string[] | null;
  points: number;
  title: string;
}
