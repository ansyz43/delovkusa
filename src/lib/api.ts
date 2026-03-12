const API_URL = import.meta.env.VITE_API_URL || "";

// In-memory token (not accessible via XSS unlike localStorage)
let _accessToken: string | null = null;

export function getAccessToken(): string | null {
  return _accessToken;
}

export function setAccessToken(token: string | null) {
  _accessToken = token;
}

// Shared refresh promise to prevent parallel refresh race condition
let _refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  try {
    const resp = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    _accessToken = data.access_token;
    return _accessToken;
  } catch {
    return null;
  }
}

export async function apiFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const headers = new Headers(options.headers || {});

  if (_accessToken) {
    headers.set("Authorization", `Bearer ${_accessToken}`);
  }

  if (
    options.body &&
    typeof options.body === "string" &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  let resp = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
    credentials: "include",
  });

  // Auto-refresh on 401 (skip auth endpoints themselves)
  if (resp.status === 401 && !url.includes("/api/auth/")) {
    if (!_refreshPromise) {
      _refreshPromise = refreshAccessToken();
    }
    const newToken = await _refreshPromise;
    _refreshPromise = null;

    if (newToken) {
      headers.set("Authorization", `Bearer ${newToken}`);
      resp = await fetch(`${API_URL}${url}`, {
        ...options,
        headers,
        credentials: "include",
      });
    }
  }

  return resp;
}
