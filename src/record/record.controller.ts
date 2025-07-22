import {
  Controller,
  Post,
  UseGuards,
  Body,
  Request,
  Get,
  Query,
  Param,
  BadRequestException,
  Put,
  Delete,
} from '@nestjs/common';
import { RecordService } from './record.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/user.entity';
import { UpdateRecordDto } from './dto/update-record.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('record')
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  // API(/record/create)
  @Post('create')
  createRecord(@Body() createRecordDto: CreateRecordDto, @Request() req) {
    return this.recordService.createRecord(createRecordDto, req.user.email);
  }

  // API(/record)
  @Get()
  findAllRecords(@Request() req) {
    return this.recordService.findAllRecords(req.user as User);
  }

  // API(/record/paginated)
  @Get('paginated')
  findAllRecordsPaginated(
    @Request() req,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.recordService.findAllRecordsPaginated(
      page,
      limit,
      req.user as User,
    );
  }

  // API(/record/getDaysRecords/:days)
  @Get('getDaysRecords/:days')
  getDaysRecords(@Request() req, @Param('days') days: number) {
    switch (days) {
      case 7:
        return this.recordService.findLast7DaysRecords(req.user as User);
      case 30:
        return this.recordService.findLast30DaysRecords(req.user as User);
      case 90:
        return this.recordService.findLast90DaysRecords(req.user as User);
      case 180:
        return this.recordService.findLast180DaysRecords(req.user as User);
      case 365:
        return this.recordService.findLast365DaysRecords(req.user as User);
      default:
        throw new BadRequestException('Invalid days');
    }
  }

  // API(/record/getDaysTotalByCategory/:days)
  @Get('getDaysTotalByCategory/:days')
  getDaysTotalByCategory(@Request() req, @Param('days') days: number) {
    switch (days) {
      case 7:
        return this.recordService.findAllLast7DaysCategoriesTotal(
          req.user as User,
        );
      case 30:
        return this.recordService.findAllLast30DaysCategoriesTotal(
          req.user as User,
        );
      case 90:
        return this.recordService.findAllLast90DaysCategoriesTotal(
          req.user as User,
        );
      case 180:
        return this.recordService.findAllLast180DaysCategoriesTotal(
          req.user as User,
        );
      case 365:
        return this.recordService.findAllLast365DaysCategoriesTotal(
          req.user as User,
        );
      default:
        throw new BadRequestException('Invalid days');
    }
  }

  // API(/record/findRecordByDescription/:description)
  @Get('findRecordByDescription/:description')
  findRecordByDescription(
    @Request() req,
    @Param('description') description: string,
  ) {
    return this.recordService.findRecordByDescription(
      description,
      req.user as User,
    );
  }

  // API(/record/:id)
  @Put('update/:id')
  updateRecord(
    @Body() updateRecordDto: UpdateRecordDto,
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.recordService.updateRecord(
      updateRecordDto,
      id,
      req.user as User,
    );
  }

  // API(/record/:id)
  @Delete('delete/:id')
  deleteRecord(@Param('id') id: string, @Request() req) {
    return this.recordService.deleteRecord(id, req.user as User);
  }
}
