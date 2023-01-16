import { EntityRepository, Repository } from "typeorm";
import { Task } from "./task.entity";

// Repositry for the task
// An alternarive means of representing
// data and mapping into database


@EntityRepository(Task)
export class TaskRepository extends Repository<Task>{

}