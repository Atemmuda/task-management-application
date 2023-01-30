import { createQueryBuilder, Repository } from "typeorm";
import { Injectable, NotFoundException } from '@nestjs/common';

import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
// import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TasksService {
    constructor(
      @InjectRepository(Task)
        private taskRepository: Repository<Task>
    ){}

/**
 * getTask - get all tasks or parts of tasks is search criterial is provided
 * @filterDto: The representation of the filters provided
 * 
 * Return: The array of tasks
 */
async getTask(filterDto: GetTaskFilterDto): Promise<Task[]>{
  const { status, search} = filterDto
  const query = this.taskRepository.createQueryBuilder("task")

  if(status){
    query.andWhere("task.status = :status", { status })
  }

  if(search){
    //Using LIKE and OR allows for a partial match of task.title and task.description to `%${search}%`
    query.andWhere("(task.title LIKE :search OR task.description LIKE :search)", { search: `%${search}%` })
  }

  const tasks = await query.getMany()
  return tasks
}

/**
 * getTaskById - gets the task with a particular id
 * @id - the id of this task
 * 
 * Return - the found task with the id
 */
  async getTaskById(id: number): Promise<Task>{
    const found = await this.taskRepository.findOneBy({id: id});

    if(!found){
      throw new NotFoundException(`Task with ID ${id} not found`) // Exception for no-id request
    }

    return found;
  }

  /**
   * createTask - creates a new task
   * @createTaskDto is the structure of the data 
   * object that will be coming in
   * 
   * Return - The newly creates task
   */
  async creatTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

        const task = new Task()
        task.title = title
        task.description = description
        task.status = TaskStatus.DONE
        await task.save()

        return task;
  }

/**
 * updateTaskStatus - Udate the task status
 * @id is the id of the task to update
 * @status is the status of task
 * 
 * Return: The task with updated status
 */
  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await task.save()
    return task;
  }

/**
 * deleteTask - delete a task with the specified id
 * @id: id of the task to be deleted
 */
  async deleteTaskById(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id)
    if (result.affected === 0){
      throw new NotFoundException(`Task with ID ${id} not found`) // Exception for no-id request
    }
  }
}
