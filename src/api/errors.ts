// Custom error classes for better error handling
export class ApiError extends Error {
	constructor(
		message: string,
		public statusCode?: number,
		public code?: string,
		public details?: unknown,
	) {
		super(message);
		this.name = "ApiError";
	}
}

export class NetworkError extends ApiError {
	constructor(
		message: string,
		public originalError?: unknown,
	) {
		super(message);
		this.name = "NetworkError";
	}
}

export class GraphQLError extends ApiError {
	constructor(
		message: string,
		public errors: Array<{
			message: string;
			path?: string[];
			extensions?: unknown;
		}>,
	) {
		super(message);
		this.name = "GraphQLError";
	}
}

export class AuthenticationError extends ApiError {
	constructor(message: string = "Authentication failed") {
		super(message, 401);
		this.name = "AuthenticationError";
	}
}
