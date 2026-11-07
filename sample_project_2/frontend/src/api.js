const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function apiRequest(path, { token, ...options } = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail || "Something went wrong. Please try again.");
  }

  if (response.status === 204) return null;
  return response.json();
}
