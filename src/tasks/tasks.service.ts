import { Repository } from "typeorm";
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
//   private tasks: Task[] = [];

//   getAllTasks(): Task[] {
//     return this.tasks;
//   }

//   //Return task with some query parameter
//   getTaskWithFilters(filterDto: GetTaskFilterDto): Task[] {
//     const { status, search } = filterDto;
//     const tasks = this.getAllTasks();
//     if (status) {
//       tasks.filter((task) => {
//         task.status = status;
//       });
//     }

//     if (search) {
//       tasks.filter((task) => {
//         task.title.includes(search) || task.description.includes(search);
//       });
//     }
//     return tasks;
//   }
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

//   updateTaskStatus(id: string, status: TaskStatus): Task {
//     const task = this.getTaskById(id);
//     task.status = status;
//     return task;
//   }

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
