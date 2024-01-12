import {Injectable, UnauthorizedException} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(error: any, user: any, info: Error) {
    if(error || info || !user) {
      throw info?.name === 'TokenExpiredError'
        ? new UnauthorizedException(
          'The Session has expired, Please login again'
        )
        : new UnauthorizedException('Token malformed')
    }

    return user
  }
}