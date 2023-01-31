import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredentialDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ){}

    async signup(authCredentialDto: AuthCredentialDto): Promise<void>{
        const { username, password } = authCredentialDto;
        
        const user = new User();
        user.username = username;
        user.password = password;

        user.save()

    }
}
