import {Module} from "@nestjs/common";
import {OrmModule} from "@lib/orm/orm.module";
import {JwtModule} from "@lib/jwt/jwt.module";
import {JwtStrategy} from "@modules/token/strategies/jwt.strategy";
import {RefreshTokensRepository} from "@modules/token/refresh-tokens.repository";

@Module({
  imports: [OrmModule, JwtModule],
  controllers: [],
  providers: [TokensService, RefreshTokensRepository, JwtStrategy],
  exports: [TokenService]
})