export interface TErrorSources {
  path: string;
  message: string;
}
export interface TErrorResponse {
  success: boolean;
  message: string;
  statusCode?: number;
  errorSources?: TErrorSources[];
  error?: unknown;
}
