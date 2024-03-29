import {BadRequestException, HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {UserLoginDto} from './dto/user-login';
import {InjectRepository} from "@mikro-orm/nestjs";
import {User} from "@entities";
import {EntityRepository} from "@mikro-orm/core";
import {TokenService} from "@modules/token/token.service";
import {IResponse} from "@common/interfaces/response.interface";
import {HelperService} from "@common/helpers/helpers.utils";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly tokenService: TokenService
  ) {}

  async login(userDto: UserLoginDto): Promise<IResponse<any>> {
    const user = await this.userRepository.findOne({
      email: userDto.email,
      isActive: true,
      isObsolete: false
    })

    if(user?.isObsolete) {
      throw new BadRequestException('Invalid credentials')
    }

    if(!user?.isActive) {
      throw new HttpException(
        'Account not found. Please create new account from the Login screen',
        HttpStatus.FORBIDDEN
      )
    }

    const token = await this.tokenService.generateAccessToken(user)
    const refresh = await this.tokenService.generateRefreshToken(
      user,
      +(process.env.JWT_REFRESH_EXPIRY || ''),
    )

    const payload = HelperService.buildPayloadResponse(
      user,
      token,
      refresh
    )

    return {
      message: 'Successfully signed in',
      data: payload
    }
  }

  // Logout the user from all the devices by invalidating all his refresh tokens
  async logoutFromAll(user: User): Promise<IResponse<any>> {
    return this.tokenService.deleteRefreshTokenForUser(user)
  }

  async logout(user: User, refreshToken: string): Promise<IResponse<any>> {
    const payload = await this.tokenService.decodeRefreshToken(
      refreshToken
    )

    return this.tokenService.deleteRefreshToken(user, payload)
  }
}
