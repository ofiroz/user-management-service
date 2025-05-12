import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { json } from 'body-parser';
import { UserResolver } from './resolvers/user.resolver';
import { buildSchema } from 'type-graphql';
import { AppDataSource } from './config/database';
import { loggingMiddleware } from './middleware/logging.middleware';
import { BaseError } from './utils/errors';

async function initializeDatabase() {
    try {
        await AppDataSource.initialize();
        console.log('Database connection established');
    } catch (error) {
        console.error('Failed to initialize database:', error);
        throw error; 
    }
}

async function createApolloServer(httpServer: http.Server) {
    try {
        const schema = await buildSchema({
            resolvers: [UserResolver],
            emitSchemaFile: true,
        });
        console.log('GraphQL schema built successfully');

        const server = new ApolloServer({
            schema,
            plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
            formatError: (error: any) => {
                const originalError = error.originalError;
                
                if (originalError instanceof BaseError) {
                    return {
                        message: originalError.message,
                        code: originalError.name,
                        path: error.path,
                    };
                }

                console.error('Unexpected error:', error);
                
                return {
                    message: 'Internal server error',
                    code: 'INTERNAL_SERVER_ERROR',
                    path: error.path,
                };
            },
        });

        await server.start();
        console.log('Apollo Server started');
        return server;
    } catch (error) {
        console.error('Failed to create Apollo Server:', error);
        throw error;
    }
}

async function startHttpServer(app: express.Application, port: number): Promise<http.Server> {
    return new Promise((resolve, reject) => {
        const server = http.createServer(app);
        server.listen({ port }, () => {
            console.log(`Server ready at http://localhost:${port}/graphql`);
            resolve(server);
        }).on('error', (error) => {
            console.error('Failed to start HTTP server:', error);
            reject(error);
        });
    });
}

export async function startServer() {
    try {
        await initializeDatabase();
        
        const app = express();
        const httpServer = http.createServer(app);
        
        const server = await createApolloServer(httpServer);
        
        app.use(cors());
        app.use(json());
        app.use(loggingMiddleware);

        app.use(
            '/graphql',
            cors<cors.CorsRequest>(),
            json(),
            expressMiddleware(server),
        );

        app.get('/health', (_req, res) => {
            res.status(200).json({ status: 'ok' });
        });

        const PORT = parseInt(process.env.PORT || '4000', 10);
        await startHttpServer(app, PORT);

        return { server, app };
    } catch (error) {
        console.error('Failed to start server:', error);
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
        process.exit(1);
    }
} 