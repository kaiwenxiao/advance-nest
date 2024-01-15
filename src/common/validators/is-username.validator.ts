/**
 *
 * Rules used:
 *
 * Only contains alphanumeric characters, underscore and dot.
 *
 * Underscore and dot can't be at the end or start of a username (e.g _username / username_ / .username / username.).
 *
 * Underscore and dot can't be next to each other (e.g user_.name).
 *
 * Underscore or dot can't be used multiple times in a row (e.g user__name / user..name).
 *
 * Number of characters must be between 6 to 20.
 *
 *
 * Tests at https://regex101.com/r/iU5BLr/1/
 */

import {
	registerDecorator,
	ValidationArguments,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({async: true})
class IsUsernameValidator implements ValidatorConstraintInterface {
	defaultMessage(validationArguments?: ValidationArguments): string {
		const property = validationArguments?.property

		return `${property} must fulfill username's criteria`
	}

	validate(value: any): Promise<boolean> | boolean {
		return /^(?=.{6,20}$)(?:[\dA-Za-z]+(?:[._-][\dA-Za-z])*)+$/.test(value);
	}
}
	export function IsUsername(validationOptions?: ValidationOptions) {
		return function (object: Record<string, any>, propertyName: string) {
			registerDecorator({
				target: object.constructor,
				propertyName,
				options: validationOptions,
				constraints: [],
				validator: IsUsernameValidator
			})
		}
	}