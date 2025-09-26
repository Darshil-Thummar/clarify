import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API client with axios
export const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL;

export function getAuthToken(): string | null {
	try {
		const raw = sessionStorage.getItem("auth_token");
		if (!raw) return null;
		const trimmed = raw.trim();
		if (!trimmed || trimmed === 'undefined' || trimmed === 'null') return null;
		return trimmed;
	} catch {
		return null;
	}
}

export function setAuthToken(token: string | null): void {
	try {
		if (typeof token === 'string' && token.trim().length > 0 && token !== 'undefined' && token !== 'null') {
			sessionStorage.setItem("auth_token", token.trim());
		} else {
			sessionStorage.removeItem("auth_token");
		}
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

// Actual login response from backend
export interface LoginApiResponse {
	ok: boolean;
	user: {
		_id: string;
		email: string;
		firstName: string;
		lastName: string;
		contact: string | null;
		deleted_at: string | null;
		createdAt: string;
		updatedAt: string;
		__v: number;
	};
	token: string;
}

export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
	return await apiRequest<AuthResponse>('POST', "/auth/register", payload);
}

export async function loginUser(payload: LoginPayload): Promise<LoginApiResponse> {
	return await apiRequest<LoginApiResponse>('POST', "/auth/login", payload);
}

export async function fetchMe<T = unknown>(): Promise<T> {
	return await apiRequest<T>('GET', "/auth/me");
}


// Analyze endpoint
export interface AnalyzeRequest {
	input: string;
	storageOptIn: boolean;
	redactNames: boolean;
}

export interface AnalyzeResponse {
	success: boolean;
	sessionId: string;
	stage: string; // e.g., "clarifying_questions"
	questions?: string[];
	needsAnswers?: boolean;
}

export async function analyze(payload: AnalyzeRequest): Promise<AnalyzeResponse> {
	return await apiRequest<AnalyzeResponse>('POST', "/v1/analyze", payload);
}



// Submit clarifying answers endpoint
export interface SubmitAnswersRequest {
    sessionId: string;
    answers: string[];
}

// Shape may evolve; keep broad typing while preserving known fields
export interface SubmitAnswersResponse {
    success: boolean;
    sessionId: string;
    stage?: string;
    narrativeLoop?: unknown;
    spiessMap?: unknown;
    summary?: unknown;
    tags?: string[];
}

export async function submitAnswers(payload: SubmitAnswersRequest): Promise<SubmitAnswersResponse> {
    return await apiRequest<SubmitAnswersResponse>('POST', "/v1/answers", payload);
}
