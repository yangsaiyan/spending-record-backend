import { Module } from '@nestjs/common';
import { RecordService } from './record.service';
import { RecordController } from './record.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Record } from './entities/record.entity';
import { User } from 'src/user/user.entity';
import { UserModule } from 'src/user/user.module';
import { Monthly } from './entities/monthly.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Record, User, Monthly]), UserModule],
  controllers: [RecordController],
  providers: [RecordService],
  exports: [RecordService],
})
export class RecordModule {}
