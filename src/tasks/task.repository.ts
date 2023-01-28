import { Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status.enum";
import { Task } from "./task.entity";

// Repositry for the task
// An alternarive means of representing
// data and mapping into database

export class TaskRepository extends Repository<Task>{

}