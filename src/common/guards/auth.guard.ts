import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {Observable} from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()

    const token = request.headers.authorization

    if(!token) {
      throw new HttpException(
        'Token not found in request',
        HttpStatus.UNAUTHORIZED
      )
    }

    try {
      const decoded: any = this.jwt.verify(token.split(' ')[1])
      request.idx = decoded.idx
      return true;
    } catch (error_: any) {
      const error =
        error_?.name === 'TokenExpiredError'
          ? new UnauthorizedException(
            'The session has expired, Please'
          )
          : new UnauthorizedException('Token malformed')

      throw error
    }

  }


}