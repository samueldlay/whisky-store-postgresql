import { Request, Response, NextFunction } from 'express';
export type MiddlewareFn = (req: Request, res: Response) => void;
export type MiddlewareFnNext = (req: Request, res: Response, next: NextFunction) => void;
