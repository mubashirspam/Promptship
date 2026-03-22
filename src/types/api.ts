export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface GenerateRequest {
  promptId?: string;
  promptText: string;
  framework: string;
  style?: string;
  animationLevel?: string;
  darkMode?: boolean;
  customInstructions?: string;
}

export interface GenerateResponse {
  id: string;
  code: string;
  framework: string;
  tokensUsed: number;
  latencyMs: number;
}
