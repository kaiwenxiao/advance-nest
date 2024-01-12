import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@mikro-orm/nestjs";
import {RefreshToken, User} from "@entities";
import {EntityRepository} from "@mikro-orm/core";

@Injectable()
export class RefreshTokensRepository {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: EntityRepository<RefreshToken>
  ) {}

  // mostly business logic should in .service file, rather than .repository ?
  // different with .module ?
  async createRefreshToken(user: User, ttl: number): Promise<RefreshToken> {
    const token = new RefreshToken()

    token.user = user
    token.isRevoked = false

    const expiration = new Date()

    // the input is treated as mili so *1000 is required

    expiration.setTime(expiration.getTime() + ttl * 1000)

    token.expiresIn = expiration

    /**
     * persist schedules an entity for insertion,
     * while flush executes the actual insertion.
     * If you want to immediately persist and flush an entity,
     * you can use the persistAndFlush method
     *
     * repository manipulate specific entity
     */
    await this.refreshTokenRepository.persistAndFlush(token)

    return token
  }

	async findTokenByIdx(id: number): Promise<RefreshToken | null> {
		return this.refreshTokenRepository.findOne({
			id,
			isRevoked: false,
		});
	}

  async deleteTokensForUser(user: User): Promise<boolean> {
    // Repository nativeUpdate and EntityManager update
    /**
     * take advantage of features like automatic dirty checking,
     * lifecycle hooks,
     * and identity map management
     *
     * const author = await em.findOne(Author, 1);
     * author.name = 'New Name';
     * await em.flush();
     */
    await this.refreshTokenRepository.nativeUpdate(
      {user},
      {isRevoked: true}
    )

    return true
  }

  async deleteToken(user: User, tokenId: number): Promise<boolean> {
    await this.refreshTokenRepository.nativeUpdate(
      { user, id: tokenId },
      { isRevoked: true },
    );

    return true;
  }
}