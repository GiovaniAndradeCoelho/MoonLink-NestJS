// src/common/interfaces/request-with-user.interface.ts
import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    id: string;
  };
}
