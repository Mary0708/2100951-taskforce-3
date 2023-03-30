import { Body, Controller, Post, Get, Param, HttpStatus, Delete} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { fillObject } from '@project/util/util-core';
import { TaskRdo } from './rdo/task.rdo';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('tasks')
@Controller('tasks')
export class TaskController {
  constructor(
    private readonly taskService: TaskService
  ) {}

  @ApiResponse({
    type: TaskRdo,
    status: HttpStatus.CREATED,
    description: 'The new task has been successfully created'
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User does not have enough rights to add a task'
  })
  @Post()
  public async create(@Body() dto: CreateTaskDto) {
    const newTask = await this.taskService.createTask(dto);
    return fillObject(TaskRdo, newTask);
  }

  @ApiResponse({
    type: TaskRdo,
    status: HttpStatus.OK,
    description: 'Task found'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Task with this ID does not exist'
  })
  @Get(':id')
  public async show(@Param('id') id: string) {
    const existTask = await this.taskService.getTask(id);
    return fillObject(TaskRdo, existTask);
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The task has been successfully deleted'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Task with this ID does not exist'
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'The user does not have enough rights to delete the task'
  })
  @Delete(':id')
  public async delete(@Param('id') id: string) {
    this.taskService.deleteTask(id);
  }
}