import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";

export function validationMiddleWare(cls: any) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const dto = plainToInstance(cls, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation failed", errors });
    }
    next();
  };
}
