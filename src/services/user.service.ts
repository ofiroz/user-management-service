import { Repository } from 'typeorm';
import { User } from '../entity/User';
import { CreateUserInput, UpdateUserInput } from '../schema/user.schema';
import { BaseError, UserNotFoundError, DatabaseError } from '../utils/errors';
import { validateName, validateBirthDate } from '../utils/validation';

export class UserService {
    constructor(private userRepository: Repository<User>) {}

    async findAll(): Promise<User[]> {
        try {
            return await this.userRepository.find();
        } catch (error) {
            throw new DatabaseError('Failed to fetch users');
        }
    }

    async findById(id: number): Promise<User | null> {
        try {
            const user = await this.userRepository.findOne({ where: { id } });
            if (!user) {
                throw new UserNotFoundError(id);
            }
            return user;
        } catch (error) {
            if (error instanceof BaseError) {
                throw error;
            }
            throw new DatabaseError('Failed to fetch user');
        }
    }

    async create(input: CreateUserInput): Promise<User> {
        try {
            validateName(input.first_name, 'First name');
            validateName(input.last_name, 'Last name');
            validateBirthDate(input.birth_date);

            const user = this.userRepository.create({
                first_name: input.first_name,
                last_name: input.last_name,
                birth_date: new Date(input.birth_date),
                city: input.city
            });

            return await this.userRepository.save(user);
        } catch (error) {
            if (error instanceof BaseError) {
                throw error;
            }
            throw new DatabaseError('Failed to create user');
        }
    }

    async update(id: number, input: UpdateUserInput): Promise<User> {
        try {
            const user = await this.userRepository.findOne({ where: { id } });
            if (!user) {
                throw new UserNotFoundError(id);
            }
            if (input.first_name) validateName(input.first_name, 'First name');
            if (input.last_name) validateName(input.last_name, 'Last name');
            if (input.birth_date) validateBirthDate(input.birth_date);

            const updatedUser = this.userRepository.merge(user, {
                ...input,
                birth_date: input.birth_date ? new Date(input.birth_date) : undefined
            });
            // console.log(updatedUser);
            return await this.userRepository.save(updatedUser);
        } catch (error) {
            if (error instanceof BaseError) {
                throw error;
            }
            throw new DatabaseError('Failed to update user');
        }
    }

    async delete(id: number): Promise<boolean> {
        try {
            const user = await this.userRepository.findOne({ where: { id } });
            if (!user) {
                throw new UserNotFoundError(id);
            }

            await this.userRepository.remove(user);
            return true;
        } catch (error) {
            if (error instanceof BaseError) {
                throw error;
            }
            throw new DatabaseError('Failed to delete user');
        }
    }
} 