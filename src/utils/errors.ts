export class BaseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class UserNotFoundError extends BaseError {
    constructor(id: number) {
        super(`User with id ${id} not found`);
    }
}

export class ValidationError extends BaseError {
    constructor(message: string) {
        super(`Validation error: ${message}`);
    }
}

export class DatabaseError extends BaseError {
    constructor(message: string) {
        super(`Database error: ${message}`);
    }
} 