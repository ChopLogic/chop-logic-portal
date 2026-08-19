// Custom service errors
export class ServiceError extends Error {
	constructor(
		message: string,
		public code: string,
		public statusCode?: number,
		public details?: unknown,
	) {
		super(message);
		this.name = "ServiceError";
	}
}

export class NotFoundError extends ServiceError {
	constructor(resource: string, identifier: string | number) {
		super(
			`${resource} with identifier "${identifier}" not found`,
			"NOT_FOUND",
			404,
			{ resource, identifier },
		);
		this.name = "NotFoundError";
	}
}

export class ValidationError extends ServiceError {
	constructor(message: string, details?: unknown) {
		super(message, "VALIDATION_ERROR", 400, details);
		this.name = "ValidationError";
	}
}

export class DataTransformationError extends ServiceError {
	constructor(message: string, originalError?: unknown) {
		super(message, "TRANSFORMATION_ERROR", 500, { originalError });
		this.name = "DataTransformationError";
	}
}
