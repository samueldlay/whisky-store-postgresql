import { Request, Response, NextFunction } from 'express';

export function logResponse (req: Request, res: Response, next: NextFunction) {

  res.on('finish', () => {
    console.log('Body: ', req.body);
    console.log(`Responded with status ${res.statusCode}`);
  });
  next();
};
