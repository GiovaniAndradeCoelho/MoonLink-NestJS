import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AppMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const validToken = process.env.API_SECRET_TOKEN;
    let tokenFromRequest = req.headers['authorization'];

    if (!tokenFromRequest) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No token provided.',
      });
    }

    if (typeof tokenFromRequest === 'string' && tokenFromRequest.startsWith('Bearer ')) {
      tokenFromRequest = tokenFromRequest.replace('Bearer ', '');
    }

    if (tokenFromRequest !== validToken) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token.',
      });
    }

    next();
  }
}