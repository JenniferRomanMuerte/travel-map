const BASE_URL = import.meta.env.VITE_API_URL;

function getToken() {
  return localStorage.getItem("travelmap_token");
}

async function request(path, options = {}) {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw Object.assign(new Error(body.error || "Error de red"), { status: res.status });
  }

  return res.json();
}

export const api = {
  get: (path) => request(path),
  post: (path, data) =>
    request(path, {
      method: "POST",
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),
  put: (path, data) =>
    request(path, { method: "PUT", body: JSON.stringify(data) }),
  delete: (path, data) =>
    request(path, {
      method: "DELETE",
      body: data ? JSON.stringify(data) : undefined,
    }),
};
