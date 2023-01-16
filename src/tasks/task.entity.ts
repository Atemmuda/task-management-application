import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TaskStatus } from "./task-status.enum"

// Entity or table for the columns that represents the database 
// for the task management application.
@Entity()
export class Task extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    status: TaskStatus;
}