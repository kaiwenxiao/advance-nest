import {Body, Controller, ParseBoolPipe, Post, Query, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import {TokenService} from "@modules/token/token.service";
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {UserLoginDto} from "@modules/auth/dto/user-login";
import {RefreshRequest} from "@modules/auth/dto/refresh-request.dto";
import {IResponse} from "@common/interfaces/response.interface";
import {User} from "@entities";
import {JwtAuthGuard} from "@common/guards/jwt.guard";
import {LoggedInUser} from "@common/decorators/user.decorator";

@ApiTags('Auth routes')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService
  ) {}

  @ApiOperation({summary: 'Login user'})
  @Post('login')
  async login(@Body() userLoginDto: UserLoginDto) {
    return this.authService.login(userLoginDto)
  }

  @ApiOperation({summary: 'Refresh token'})
  @Post('token/refresh')
  public async refresh(@Body() body: RefreshRequest): Promise<any> {
    const {token} =
      await this.tokenService.createAccessTokenFromRefreshToken(
        body.refreshToken
      )

    return token
  }

  @ApiOperation({ summary: 'Logout user' })
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @LoggedInUser() user: User,
    @Body() refreshToken: RefreshRequest,
    @Query('from_all', ParseBoolPipe) fromAll = false,
  ): Promise<IResponse<any>> {
    return fromAll
      ? this.authService.logoutFromAll(user)
      : this.authService.logout(user, refreshToken.refreshToken);
  }
}
