import { Test, TestingModule } from '@nestjs/testing';
import { TransportsController } from './transports.controller';
import { TransportsService } from './transports.service';

describe('TransportsController', () => {
  let controller: TransportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransportsController],
      providers: [TransportsService],
    }).compile();

    controller = module.get<TransportsController>(TransportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
