import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";
import * as  bcrypt from 'bcrypt';

@Entity()
@Unique(['username'])
export class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username:string;

    @Column()
    password:string;

    @Column()
    salt: string

    /**
     * validatePassword - Validate signin password against signup password
     * @param password 
     * @returns - true if password matches the hashed user password
     */

    async validatePassword(password: string): Promise<boolean>{
        const hash = bcrypt.hash(password, this.salt)
        return hash === this.password
    }
}
