import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RecordModule } from './record/record.module';
import { OtpModule } from './otp/otp.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    AuthModule,
    UserModule,
    RecordModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: false,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    ScheduleModule.forRoot(),
    OtpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
