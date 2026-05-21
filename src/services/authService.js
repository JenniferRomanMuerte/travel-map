import { api } from "../lib/api";

export async function register(email, password, username) {
  const { token, user } = await api.post("/auth/register", { email, password, username });
  localStorage.setItem("travelmap_token", token);
  return user;
}

export async function login(email, password) {
  const { token, user } = await api.post("/auth/login", { email, password });
  localStorage.setItem("travelmap_token", token);
  return user;
}

export async function logout() {
  localStorage.removeItem("travelmap_token");
  localStorage.removeItem("travelmap_username");
}

export async function getCurrentUser() {
  const token = localStorage.getItem("travelmap_token");
  if (!token) return null;

  try {
    const { user } = await api.get("/auth/me");
    return user;
  } catch {
    localStorage.removeItem("travelmap_token");
    return null;
  }
}
