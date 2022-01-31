import { ValidationPipeOptions } from '@nestjs/common';
import {
    ValidationArguments,
    registerDecorator,
} from 'class-validator';
import * as sdk from 'stellar-sdk';


export function IsStellarAddress(property: string, validationOptions?: ValidationPipeOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isStellarAddress',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                defaultMessage: () => 'Bad Stellar account',
                validate(value: any, args: ValidationArguments) {
                    return sdk.StrKey.isValidEd25519PublicKey(value) || sdk.StrKey.isValidMed25519PublicKey(value);
                },
            },
        });
    };
}
