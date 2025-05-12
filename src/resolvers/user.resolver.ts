import { Resolver, Query, Mutation, Arg, ID } from "type-graphql";
import { User } from "../entity/User";
import { AppDataSource } from "../config/database";
import { CreateUserInput, UpdateUserInput } from "../schema/user.schema";
import { UserService } from "../services/user.service";

@Resolver(User)
export class UserResolver {
    private userService: UserService;

    constructor() {
        this.userService = new UserService(AppDataSource.getRepository(User));
    }

    @Query(() => [User])
    async users(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Query(() => User, { nullable: true })
    async user(@Arg("id", () => ID) id: string): Promise<User | null> {
        if (!id) {
            throw new Error("User ID is required");
        }
        return this.userService.findById(parseInt(id));
    }

    @Mutation(() => User)
    async createUser(@Arg("input") input: CreateUserInput): Promise<User> {
        if (!input.first_name?.trim()) {
            throw new Error("First name is required");
        }
        if (!input.last_name?.trim()) {
            throw new Error("Last name is required");
        }
        if (!input.birth_date) {
            throw new Error("Birth date is required");
        }
        if (!input.city) {
            throw new Error("City is required");
        }
        return this.userService.create(input);
    }

    @Mutation(() => User)
    async updateUser(
        @Arg("id", () => ID) id: string,
        @Arg("input") input: UpdateUserInput
    ): Promise<User> {
        if (!id) {
            throw new Error("User ID is required");
        }
        if (!input.first_name?.trim() && !input.last_name?.trim() && !input.birth_date && !input.city) {
            throw new Error("At least one field must be provided for update");
        }
        return this.userService.update(parseInt(id), input);
    }

    @Mutation(() => Boolean)
    async deleteUser(@Arg("id", () => ID) id: string): Promise<boolean> {
        if (!id) {
            throw new Error("User ID is required");
        }
        return this.userService.delete(parseInt(id));
    }
} 