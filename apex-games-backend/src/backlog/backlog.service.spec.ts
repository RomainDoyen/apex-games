import { Test, TestingModule } from '@nestjs/testing';
import { BacklogService } from './backlog.service';

describe('BacklogService', () => {
  let service: BacklogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BacklogService],
    }).compile();

    service = module.get<BacklogService>(BacklogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
