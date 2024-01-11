import {Injectable, UnauthorizedException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {User} from "@entities";
import {EntityRepository} from "@mikro-orm/core";
import {InjectRepository} from "@mikro-orm/nestjs";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: EntityRepository<User>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false
    })
  }

  async validate(
    payload: {idx: string},
    done: (arg0: any, arg1: User) => void
  ) {
    const {idx} = payload
    const user = await this.userRepo.findOne({idx})

    if(!user) {
      throw new UnauthorizedException('User not found')
    }

    done(null, user)
  }
}