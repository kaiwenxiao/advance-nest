import { EntityProperty, Type, ValidationError } from '@mikro-orm/core';
import { decrypt, encrypt } from 'helper-fns';

export class EncryptedType extends Type<string> {
	private readonly encKey = process.env.ENC_KEY!
	private readonly encIV = process.env.ENC_IV!

	convertToDatabaseValue(value: string): string {
		if (value && !(typeof value.valueOf() === 'string')) {
			throw ValidationError.invalidType(EncryptedType, value, 'JS');
		}

		return encrypt({ text: value.toString(), config: { key: this.encKey, iv: this.encIV } });
	}

	convertToJSValue(value: string): string {
		if (!value) {
			return value;
		}

		return decrypt({ text: value, config: { key: this.encKey, iv: this.encIV } });
	}

	getColumnType(prop: EntityProperty): string {
		return `varchar(${prop.length})`
	}
}