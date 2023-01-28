import "reflect-metadata"
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'root',
    database: 'taskmanagement',
    autoLoadEntities: true,
    entities: [__dirname + "/../**/*.entity.ts"],
    synchronize: true // true is not recommended in production
};