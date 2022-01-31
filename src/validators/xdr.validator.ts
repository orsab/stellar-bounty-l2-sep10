import { ValidationPipeOptions } from '@nestjs/common';
import {
    ValidationArguments,
    registerDecorator
  } from 'class-validator';
  import * as sdk from 'stellar-sdk';
  
  export function IsXDR(property: string, validationOptions?: ValidationPipeOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        name: 'isXDR',
        target: object.constructor,
        propertyName: propertyName,
        constraints: [property],
        options: validationOptions,
        validator: {
            defaultMessage: () => 'Bad XDR format',
            validate(value: any, args: ValidationArguments) {
            try {
                return sdk.xdr.TransactionEnvelope.validateXDR(
                  value,'base64'
                );
              } catch (error) {
                return false;
              }
          },
        },
      });
    };
  }