import { DataSource } from "typeorm";
import { User } from "../entity/User";
import { CreateUserTable1700000000000 } from "../migrations/1700000000000-CreateUserTable";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "user_management",
    synchronize: false,
    logging: process.env.NODE_ENV !== "production",
    entities: [User],
    migrations: [CreateUserTable1700000000000],
    migrationsRun: true,
    // subscribers: [],
}); 