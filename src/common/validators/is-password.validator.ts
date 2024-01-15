import {
	registerDecorator,
	ValidationArguments,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({async: true})
class IsPasswordValidator implements ValidatorConstraintInterface {
	defaultMessage(validationArguments?: ValidationArguments): string {
		const property = validationArguments?.property
		return `${property} must be fulfill password's criteria`
	}

	async validate(value: string, _args: ValidationArguments){
		const passwordRegex = new RegExp(
			'^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])(?=.{8,})',
		)

		return passwordRegex.test(value)
	}
}

export function IsPassword(validationOptions?: ValidationOptions) {
	return function(object: Record<string, any>, propertyName: string): void {
		registerDecorator({
			target: object.constructor,
			propertyName,
			options: validationOptions,
			constraints: [],
			validator: IsPasswordValidator
		})
	}
}