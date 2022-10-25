import { createParamDecorator, ExecutionContext } from '@nestjs/common';

//Decorateur recuperateur via @User
//grace à createparamdecorator
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
