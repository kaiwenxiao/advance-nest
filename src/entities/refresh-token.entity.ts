import {Entity, ManyToOne, Property} from "@mikro-orm/core";
import {BaseEntity} from "@common/database/base-entity.entity";
import {User} from "./user.entity";

@Entity()
export class RefreshToken extends BaseEntity {
  @Property({
    nullable: false,
    name: 'expires_in'
  })
  expiresIn: Date

  @ManyToOne(() => User)
  user: User

  @Property({
    nullable: false,
    default: false,
    type: 'boolean'
  })
  isRevoked: boolean
}