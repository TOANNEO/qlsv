const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

function buildUrl(path, query) {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(API_BASE_URL + normalized);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });
  }
  return url.toString();
}

function buildHeaders(token, headers, hasBody) {
  const baseHeaders = {
    Accept: 'application/json',
    ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
  };

  if (token) {
    baseHeaders.Authorization = `Bearer ${token}`;
  }

  return {
    ...baseHeaders,
    ...headers,
  };
}

export async function httpClient(path, { method = 'GET', body, headers = {}, token, query } = {}) {
  const response = await fetch(buildUrl(path, query), {
    method,
    headers: buildHeaders(token, headers, Boolean(body)),
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message = (isJson && payload?.message) || response.statusText;
    throw new Error(message || 'Request failed');
  }

  return payload;
}
