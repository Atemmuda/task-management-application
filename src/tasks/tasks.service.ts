import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.module';
import * as uuid from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  //Return task with some query parameter
  getTaskWithFilters(filterDto: GetTaskFilterDto): Task[] {
    const { status, search } = filterDto;
    const tasks = this.getAllTasks();
    if (status) {
      tasks.filter((task) => {
        task.status = status;
      });
    }

    if (search) {
      tasks.filter((task) => {
        task.title.includes(search) || task.description.includes(search);
      });
    }
    return tasks;
  }

  getTaskById(id: string): Task {
    const found = this.tasks.find((task) => task.id === id);

    if(!found){
      throw new NotFoundException(`Task with ID ${id} not found`) // Exception for no-id request
    }

    return found;
  }

  creatTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuid.v1(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);

    return task;
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }

  deleteTaskById(id: string): void {
    const found = this.getTaskById(id);
    this.tasks = this.tasks.filter((task) => task.id !== found.id);
  }
}
