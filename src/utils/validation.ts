import { ValidationError } from './errors';

export const USER_CONSTANTS = {
    MAX_NAME_LENGTH: 100,
    MIN_NAME_LENGTH: 2,
    DATE_FORMAT: 'YYYY-MM-DD HH:mm:ss.SSSSSS'
} as const;

export function validateName(name: string, field: string): void {
    if (name.length < USER_CONSTANTS.MIN_NAME_LENGTH) {
        throw new ValidationError(`${field} must be at least ${USER_CONSTANTS.MIN_NAME_LENGTH} characters long`);
    }
    if (name.length > USER_CONSTANTS.MAX_NAME_LENGTH) {
        throw new ValidationError(`${field} must not exceed ${USER_CONSTANTS.MAX_NAME_LENGTH} characters`);
    }
    if (!/^[a-zA-Z\s-']+$/.test(name)) {
        throw new ValidationError(`${field} can only contain letters, spaces, hyphens, and apostrophes`);
    }
}

export function validateBirthDate(date: string): void {
    const birthDate = new Date(date);
    const now = new Date();
    
    if (isNaN(birthDate.getTime())) {
        throw new ValidationError('Invalid birth date format');
    }
    
    if (birthDate > now) {
        throw new ValidationError('Birth date cannot be in the future');
    }
    
    const age = now.getFullYear() - birthDate.getFullYear();
    if (age > 150) {
        throw new ValidationError('Birth date seems invalid (age > 150 years)');
    }
} 