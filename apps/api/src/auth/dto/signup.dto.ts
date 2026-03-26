import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class SignupDto {
    @IsString()
    @MinLength(2)
    firstName!: string;

    @IsString()
    @MinLength(2)
    lastName!: string;

    @IsEmail()
    email!: string;

    @IsString()
    @Matches(/^(0[7-9][0-1]\d{8}|234[7-9][0-1]\d{8})$/, {
        message: 'Phone must be a valid Nigerian number',
    })
    phone!: string;

    @IsString()
    @MinLength(8)
    password!: string;
}
