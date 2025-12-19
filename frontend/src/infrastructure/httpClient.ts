import axios from 'axios';

export interface ErrorResponseBody {
  statusCode?: number;
  message?: string;
  details?: unknown;
}

const apiBaseUrl = import.meta.env?.VITE_API_BASE_URL ?? '/api/v1';

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function extractErrorMessages(error: unknown): string[] {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ErrorResponseBody | undefined;
    if (Array.isArray(data?.details)) {
      return data.details.map((detail) => String(detail));
    }
    if (typeof data?.message === 'string') {
      return data.message.split('\n').filter(Boolean);
    }
  }

  if (error instanceof Error && error.message) {
    return [error.message];
  }

  return ['Đã xảy ra lỗi không xác định'];
}
