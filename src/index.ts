import 'reflect-metadata';
import { startServer } from './app';

startServer().catch((error) => {
    console.error('Error starting server:', error);
    process.exit(1);
}); 