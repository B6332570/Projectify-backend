import { Test, TestingModule } from '@nestjs/testing';
import { TaskGroupController } from './task-group.controller';
import { TaskGroupService } from './task-group.service';

describe('TaskGroupController', () => {
  let controller: TaskGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskGroupController],
      providers: [TaskGroupService],
    }).compile();

    controller = module.get<TaskGroupController>(TaskGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
