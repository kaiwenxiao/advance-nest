import {createParamDecorator, ExecutionContext} from "@nestjs/common";

export const GetUserIdx = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    return context.switchToHttp().getRequest().idx
  }
)