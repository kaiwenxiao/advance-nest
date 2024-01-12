import {Module} from "@nestjs/common";
import {OrmModule} from "@lib/orm/orm.module";
import {JwtModule} from "@lib/jwt/jwt.module";
import {JwtStrategy} from "@modules/token/strategies/jwt.strategy";
import {RefreshTokensRepository} from "@modules/token/refresh-tokens.repository";
import {TokenService} from "@modules/token/token.service";

@Module({
  imports: [OrmModule, JwtModule],
  controllers: [],
  providers: [TokenService, RefreshTokensRepository, JwtStrategy],
  exports: [TokenService]
})
export class TokenModule {}