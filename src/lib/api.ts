import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API client with axios
export const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || "https://clarify-be.onrender.com";

export function getAuthToken(): string | null {
	try {
		return sessionStorage.getItem("auth_token");
	} catch {
		return null;
	}
}

export function setAuthToken(token: string | null): void {
	try {
		if (token) sessionStorage.setItem("auth_token", token);
		else sessionStorage.removeItem("auth_token");
	} catch {
		// ignore
	}
}

// Create axios instance
const apiClient: AxiosInstance = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
	(config) => {
		const token = getAuthToken();
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
	(response: AxiosResponse) => {
		return response;
	},
	(error) => {
		if (error.response?.data?.message) {
			throw new Error(error.response.data.message);
		} else if (error.response?.data?.error) {
			throw new Error(error.response.data.error);
		} else if (error.message) {
			throw new Error(error.message);
		} else {
			throw new Error(`HTTP ${error.response?.status || 'Unknown error'}`);
		}
	}
);

export async function apiRequest<T = unknown>(method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', path: string, data?: unknown): Promise<T> {
	const response = await apiClient.request({
		method,
		url: path,
		data,
	});
	return response.data;
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
	success: boolean;
	message: string;
	data: {
		user: {
			_id: string;
			username: string;
			email: string;
			firstName: string;
			lastName: string;
		};
		token: string;
	};
}

export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
	return await apiRequest<AuthResponse>('POST', "/auth/register", payload);
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
	return await apiRequest<AuthResponse>('POST', "/auth/login", payload);
}

export async function fetchMe<T = unknown>(): Promise<T> {
	return await apiRequest<T>('GET', "/auth/me");
}


