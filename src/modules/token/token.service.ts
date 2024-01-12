import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RefreshTokensRepository } from '@modules/token/refresh-tokens.repository';
import { JwtService, JwtSignOptions, TokenExpiredError } from '@nestjs/jwt';
import { InjectRepository } from '@mikro-orm/nestjs';
import { RefreshToken, User } from '@entities';
import { EntityRepository } from '@mikro-orm/core';
import { pick } from 'helper-fns';
import { IResponse } from '@common/interfaces/response.interface';

export interface RefreshTokenPayload {
	// jwt id
	jti: number
	sub: number
}

@Injectable()
export class TokenService {
	private readonly tokens: RefreshTokensRepository
	private readonly jwt: JwtService
	private readonly BASE_OPTIONS: JwtSignOptions = {
		issuer: 'some-app',
		audience: 'some-app'
	}

	constructor(
		tokens: RefreshTokensRepository,
		jwt: JwtService,
		@InjectRepository(User)
		private readonly userRepository: EntityRepository<User>
	) {
		this.tokens = tokens
		this.jwt = jwt
	}

	async generateAccessToken(user: User): Promise<string> {
		const options: JwtSignOptions = {
			...this.BASE_OPTIONS,
			subject: String(user.id)
		}

		return this.jwt.signAsync({...pick(user, ['id', 'idx'])}, options)
	}

	async generateRefreshToken(user: User, expiresIn: number): Promise<string> {
		const token = await this.tokens.createRefreshToken(user, expiresIn)

		const options: JwtSignOptions = {
			...this.BASE_OPTIONS,
			expiresIn,
			subject: String(user.id),
			jwtid: String(token.id)
		}

		return this.jwt.signAsync({}, options)
	}

	async resolveRefreshToken(
		encoded: string
	): Promise<{ user: User; token: RefreshToken }> {
		const payload = await this.decodeRefreshToken(encoded);
		const token = await this.getStoredTokenFromRefreshTokenPayload(payload);

		if (!token) {
			throw new UnauthorizedException('Refresh token not found');
		}

		if (token.isRevoked) {
			throw new UnauthorizedException('Refresh token revoked');
		}

		const user = await this.getUserFromRefreshTokenPayload(payload);

		if (!user) {
			throw new UnauthorizedException('Refresh token malformed');
		}

		return { user, token };
	}

	async createAccessTokenFromRefreshToken(
		refresh: string,
	): Promise<{ token: string; user: User }> {
		const { user } = await this.resolveRefreshToken(refresh);

		const token = await this.generateAccessToken(user);

		return { user, token };
	}

	async decodeRefreshToken(token: string): Promise<RefreshTokenPayload> {
		try {
			return this.jwt.verify(token)
		} catch (error_) {
			const error =
				error_ instanceof TokenExpiredError
					? new UnauthorizedException('Refresh token expired')
					: new UnauthorizedException('Refresh token malformed')

				throw error
		}
	}


	async deleteRefreshTokenForUser(user: User): Promise<IResponse<User>> {
		await this.tokens.deleteTokensForUser(user);

		return { message: 'Operation Successful', data: user };
	}

	async deleteRefreshToken(
		user: User,
		payload: RefreshTokenPayload
	): Promise<IResponse<User>> {
		const tokenId = payload.jti

		if(!tokenId) {
			throw new UnauthorizedException('Refresh token malformed')
		}

		await this.tokens.deleteToken(user, tokenId)

		return {message:'Operation Successful', data: user}
	}

	private async getUserFromRefreshTokenPayload(
		payload: RefreshTokenPayload,
	): Promise<User | null> {
		const subId = payload.sub;

		if (!subId) {
			throw new UnauthorizedException('Refresh token malformed');
		}

		return this.userRepository.findOne({
			id: subId,
		});
	}

	private async getStoredTokenFromRefreshTokenPayload(
		payload: RefreshTokenPayload
	): Promise<RefreshToken | null> {
		const tokenId = payload.jti

		if(!tokenId) {
			throw new UnauthorizedException('Refresh token malformed')
		}

		return this.tokens.findTokenByIdx(tokenId)
	}
}