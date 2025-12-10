/**
 * @module utils/errors
 * @description Custom error classes for application
 */
/**
 * Base application error class
 * All custom errors should extend this class
 */
export class AppError extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        Error.captureStackTrace(this, this.constructor);
        // Set the prototype explicitly
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
/**
 * 400 Bad Request - Invalid input
 */
export class ValidationError extends AppError {
    constructor(message = 'Validation failed') {
        super(message, 400, true);
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}
/**
 * 401 Unauthorized - Authentication required
 */
export class UnauthorizedError extends AppError {
    constructor(message = 'Authentication required') {
        super(message, 401, true);
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
}
/**
 * 403 Forbidden - Insufficient permissions
 */
export class ForbiddenError extends AppError {
    constructor(message = 'Access forbidden') {
        super(message, 403, true);
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }
}
/**
 * 404 Not Found - Resource not found
 */
export class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 404, true);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}
/**
 * 409 Conflict - Resource already exists
 */
export class ConflictError extends AppError {
    constructor(message = 'Resource already exists') {
        super(message, 409, true);
        Object.setPrototypeOf(this, ConflictError.prototype);
    }
}
/**
 * 422 Unprocessable Entity - Validation error with details
 */
export class UnprocessableEntityError extends AppError {
    errors;
    constructor(message = 'Unprocessable entity', errors = {}) {
        super(message, 422, true);
        this.errors = errors;
        Object.setPrototypeOf(this, UnprocessableEntityError.prototype);
    }
}
/**
 * 500 Internal Server Error - Database errors
 */
export class DatabaseError extends AppError {
    constructor(message = 'Database operation failed') {
        super(message, 500, false);
        Object.setPrototypeOf(this, DatabaseError.prototype);
    }
}
/**
 * 503 Service Unavailable - External service errors
 */
export class ServiceUnavailableError extends AppError {
    constructor(message = 'Service temporarily unavailable') {
        super(message, 503, true);
        Object.setPrototypeOf(this, ServiceUnavailableError.prototype);
    }
}
