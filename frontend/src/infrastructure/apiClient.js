const DEFAULT_BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
  process.env.REACT_APP_API_BASE_URL ||
  "/api/v1";

const normalizeBaseUrl = (base) => {
  if (!base) return "";
  return base.endsWith("/") ? base.slice(0, -1) : base;
};

const baseApiUrl = normalizeBaseUrl(DEFAULT_BASE_URL);

const buildUrl = (path, params) => {
  const sanitizedPath = path.startsWith("/") ? path : `/${path}`;
  const query = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      query.append(key, value);
    });
  }
  const queryString = query.toString();
  return `${baseApiUrl}${sanitizedPath}${queryString ? `?${queryString}` : ""}`;
};

const parseResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json().catch(() => null) : await response.text();

  if (!response.ok) {
    const message =
      (payload && (payload.message || payload.error || JSON.stringify(payload))) ||
      response.statusText ||
      "Request failed";
    throw new Error(message);
  }

  return payload;
};

const request = async (method, path, { body, params, token } = {}) => {
  const url = buildUrl(path, params);
  const headers = {
    Accept: "application/json",
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  return parseResponse(response);
};

export const apiClient = {
  get: (path, options) => request("GET", path, options),
  post: (path, body, options) => request("POST", path, { ...options, body }),
  put: (path, body, options) => request("PUT", path, { ...options, body }),
  delete: (path, options) => request("DELETE", path, options),
};

export default apiClient;
