import { Test, TestingModule } from '@nestjs/testing';
import { TaskItemService } from './task-item.service';

describe('TaskItemService', () => {
  let service: TaskItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskItemService],
    }).compile();

    service = module.get<TaskItemService>(TaskItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
