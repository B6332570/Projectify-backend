import { Test, TestingModule } from '@nestjs/testing';
import { TaskItemController } from './task-item.controller';
import { TaskItemService } from './task-item.service';

describe('TaskItemController', () => {
  let controller: TaskItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskItemController],
      providers: [TaskItemService],
    }).compile();

    controller = module.get<TaskItemController>(TaskItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
