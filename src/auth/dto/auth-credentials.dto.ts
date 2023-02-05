import { IsString, Matches, MaxLength, MinLength } from "class-validator"

export class AuthCredentialDto{
    @IsString()
    @MaxLength(20)
    @MinLength(6)
    username: string
    
    @IsString()
    @MaxLength(20)
    @MinLength(4)
    @Matches(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        { message: "password too weak" }
        )
    password:string
}