import { UserProfile } from '../domain/models/user';

export interface ApiError extends Error {
  status?: number;
  details?: string[];
  raw?: unknown;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1';
const AUTH_STORAGE_KEY = 'qlsv.auth.user';

function getStoredUser(): UserProfile | null {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as UserProfile;
  } catch (error) {
    console.error('Failed to parse stored user', error);
    return null;
  }
}

export function persistUser(user: UserProfile | null): void {
  if (!user) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function toApiError(error: unknown): ApiError {
  if ((error as ApiError)?.message) {
    return error as ApiError;
  }

  const apiError = new Error('Unexpected error') as ApiError;
  apiError.raw = error;
  return apiError;
}

function getAuthHeader(): Record<string, string> {
  const storedUser = getStoredUser();
  if (storedUser?.token) {
    return { Authorization: `Bearer ${storedUser.token}` };
  }
  return {};
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');

  if (!response.ok) {
    let message = response.statusText;
    let details: string[] | undefined;

    if (isJson) {
      try {
        const body = await response.json();
        message = body?.message ?? message;
        if (Array.isArray(body?.details)) {
          details = body.details.map((detail: unknown) => String(detail));
        }
      } catch (error) {
        console.error('Failed to parse error response', error);
      }
    } else {
      try {
        const text = await response.text();
        message = text || message;
      } catch (error) {
        console.error('Failed to read error text', error);
      }
    }

    const apiError: ApiError = Object.assign(new Error(message), {
      status: response.status,
      details,
    });
    throw apiError;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  if (isJson) {
    return (await response.json()) as T;
  }

  return (await response.text()) as T;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
};

export function parseErrorMessages(error: unknown): string[] {
  const apiError = toApiError(error);
  if (apiError.details?.length) {
    return apiError.details;
  }

  if (apiError.message.includes('\n')) {
    return apiError.message.split('\n').map((item) => item.trim()).filter(Boolean);
  }

  return [apiError.message || 'Đã xảy ra lỗi không xác định'];
}

export function getDefaultUser(): UserProfile {
  return getStoredUser() ?? { name: 'Demo Admin', roles: ['ADMIN'] };
}
