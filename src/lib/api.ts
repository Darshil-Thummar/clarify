// Lightweight API client with auth token support
export const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || "https://clarify-be.onrender.com";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestOptions {
	method?: HttpMethod;
	path: string;
	body?: unknown;
	useAuth?: boolean;
}

export function getAuthToken(): string | null {
	try {
		return localStorage.getItem("auth_token");
	} catch {
		return null;
	}
}

export function setAuthToken(token: string | null): void {
	try {
		if (token) localStorage.setItem("auth_token", token);
		else localStorage.removeItem("auth_token");
	} catch {
		// ignore
	}
}

export async function apiRequest<T = unknown>({ method = "POST", path, body, useAuth = false }: RequestOptions): Promise<T> {
	const headers: Record<string, string> = { "Content-Type": "application/json" };
	if (useAuth) {
		const token = getAuthToken();
		if (token) headers["Authorization"] = `Bearer ${token}`;
	}

	const response = await fetch(`${API_BASE_URL}${path}`, {
		method,
		headers,
		body: body ? JSON.stringify(body) : undefined,
	});

	if (!response.ok) {
		let errorMessage = `HTTP ${response.status}`;
		try {
			const err = await response.json();
			errorMessage = err?.message || err?.error || errorMessage;
		} catch {
			// not json
		}
		throw new Error(errorMessage);
	}

	// try json, allow empty
	try {
		return (await response.json()) as T;
	} catch {
		return undefined as unknown as T;
	}
}

// Auth endpoints
export interface RegisterPayload {
	username: string;
	email: string;
	password: string;
	firstName: string;
	lastName: string;
}

export interface LoginPayload {
	username?: string;
	email?: string;
	password: string;
}

export interface AuthResponse {
	token: string;
	user?: unknown;
}

export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
	return await apiRequest<AuthResponse>({ path: "/auth/register", body: payload, method: "POST" });
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
	return await apiRequest<AuthResponse>({ path: "/auth/login", body: payload, method: "POST" });
}

export async function fetchMe<T = unknown>(): Promise<T> {
	return await apiRequest<T>({ path: "/auth/me", method: "GET", useAuth: true });
}


