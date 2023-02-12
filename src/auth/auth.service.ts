import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as  bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { AuthCredentialDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { JwtPayload } from './jwt-payload.interface';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService
    ){}

     /**
     * hashPassword - hash a string password
     * @param password: password string
     * @param salt: random string to accompany password
     * 
     * @returns- hashed password 
     */
     private async hashPassword(password: string, salt: string): Promise<string>{
        return bcrypt.hash(password, salt);
    }

    /**
     * signup - user signup method
     * @param authCredentialDto: DTO for the user credentials
     * @returns - nothing
     */
    async signUp(authCredentialDto: AuthCredentialDto): Promise<void>{
        const { username, password } = authCredentialDto;

        const user = new User();
        user.username = username;
        user.salt = await bcrypt.genSalt()
        user.password = await this.hashPassword(password, user.salt);

        console.log(user.password)
        // saving user on condition that the username does not already
        // exist in database
        try {
            await user.save()
        } catch (error) {
            if(error.code === "23505"){ // duplicate usernames (conflict)
                throw new ConflictException("Username already exists");
            }else{
                throw new InternalServerErrorException();
            }
        }
    }

     /**
     * validateUserPassword - validate the password used for signup of the user
     * against the password used for signin
     * @param authCredentialsDto : Dto of the user
     * 
     * @returns - username 
     */
     private async validateUserPassword(authCredentialDto: AuthCredentialDto): Promise<string>{
        const { username, password } = authCredentialDto;
        const user  = await this.userRepository.findOneBy({ username })

        if(user && user.validatePassword(password)){
            return user.username;
        }else{
            return null
        }
    }

    /**
     * signIn - signing in of the user
     * @param authCredentialDto: DTO for the user credentials
     * 
     * @returns - nothing 
     */
    async signIn(authCredentialDto: AuthCredentialDto): Promise<{accessToken: string}>{
        const username = await this.validateUserPassword(authCredentialDto)
        if(!username){
            throw new UnauthorizedException("Invalid credentials")
        }
        const payload:JwtPayload = { username }
        const accessToken = this.jwtService.sign(payload)
        return { accessToken }
    }
}
