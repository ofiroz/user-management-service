import { Request, Response, NextFunction } from 'express';

export function loggingMiddleware(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const { method, url, body, query } = req;

    // Log request
    console.log(`[${new Date().toISOString()}] ${method} ${url}`);
    if (Object.keys(query).length) console.log('Query:', query);
    if (Object.keys(body).length) console.log('Body:', body);

    // Log response
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(
            `[${new Date().toISOString()}] ${method} ${url} ${res.statusCode} - ${duration}ms`
        );
    });

    next();
} 