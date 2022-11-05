import { Request, Response, NextFunction } from 'express';
export { setUserInfo, requiresAuthentication, isAuthenticated };
declare type User = {
    username: string;
};
declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}
declare function isAuthenticated(req: Request): req is Request & Required<Pick<Request, 'user'>>;
declare function requiresAuthentication(req: Request, res: Response, next: NextFunction): void;
declare function setUserInfo(req: Request, res: Response, next: NextFunction): void;
