import { Request, Response, NextFunction } from "express"


export const logger = (req: Request, res: Response, next: NextFunction) => {
    console.log('ip:', req.ip);
    next();
}
//pr l'appel===>>> app.module.ts