import { UserService } from '../services/user.service';
import { User } from '../entity/User';
import { UserNotFoundError, ValidationError } from '../utils/errors';
import { Repository } from 'typeorm';
import { CreateUserInput } from '../schema/user.schema';
import { City } from '../entity/User';
import '@jest/globals';

describe('UserService', () => {
    let userService: UserService;
    let mockRepository: jest.Mocked<Repository<User>>;

    beforeEach(() => {
        mockRepository = {
            find: jest.fn(),
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
        } as any;

        userService = new UserService(mockRepository);
    });

    describe('findAll', () => {
        it('should return all users', async () => {
            const mockUsers: User[] = [
                {
                    id: 1,
                    first_name: 'John',
                    last_name: 'Doe',
                    birth_date: new Date(),
                    city: City.NEW_YORK,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ];
            mockRepository.find.mockResolvedValue(mockUsers);

            const result = await userService.findAll();
            expect(result).toEqual(mockUsers);
            expect(mockRepository.find).toHaveBeenCalled();
        });
    });

    describe('findById', () => {
        it('should return user if found', async () => {
            const mockUser = { id: 1, first_name: 'John', last_name: 'Doe' };
            mockRepository.findOneBy.mockResolvedValue(mockUser as User);

            const result = await userService.findById(1);
            expect(result).toEqual(mockUser);
            expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
        });

        it('should throw UserNotFoundError if user not found', async () => {
            mockRepository.findOneBy.mockResolvedValue(null);

            await expect(userService.findById(1)).rejects.toThrow(UserNotFoundError);
        });
    });

    it('should create a user', async () => {
        const now = new Date();
        const mockUser: User = {
            id: 1,
            first_name: 'John',
            last_name: 'Doe',
            birth_date: now,
            city: City.NEW_YORK,
            created_at: now,
            updated_at: now,
        };

        const createUserInput: CreateUserInput = {
            first_name: 'John',
            last_name: 'Doe',
            birth_date: now.toISOString(),
            city: City.NEW_YORK,
        };

        mockRepository.create.mockReturnValue(mockUser);
        mockRepository.save.mockResolvedValue(mockUser);

        const result = await userService.create(createUserInput);

        expect(mockRepository.create).toHaveBeenCalledWith({
            ...createUserInput,
            birth_date: expect.any(Date),
        });
        expect(mockRepository.save).toHaveBeenCalledWith(mockUser);
        expect(result).toBe(mockUser);
    });

    it('should throw ValidationError for invalid input', async () => {
        const input = {
            first_name: 'J', // Too short
            last_name: 'Doe',
            birth_date: '1990-01-01',
            city: City.NEW_YORK,
        };

        await expect(userService.create(input)).rejects.toThrow(ValidationError);
    });
}); 