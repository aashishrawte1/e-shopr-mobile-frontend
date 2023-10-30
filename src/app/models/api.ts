// *** Generic ***
export interface ApiResponse {
  status: Status;
  result?: any;
}
export interface Status {
  code: number;
  description?: string;
}
