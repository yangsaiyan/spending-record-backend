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
  ParseIntPipe,
} from '@nestjs/common';
import { RecordService } from './record.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { AuthGuard } from '@nestjs/passport';
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

  // API(/record/getAll)
  @Get('getAll')
  findAllRecords(@Request() req) {
    return this.recordService.findAllRecords(req.user.email);
  }

  // API(/record/paginated)
  @Get('paginated/:page/:limit')
  async getPaginated(
    @Param('page', ParseIntPipe) page = 1,
    @Param('limit', ParseIntPipe) limit = 10,
    @Request() req,
  ) {
    return this.recordService.findAllRecordsPaginated(
      page,
      limit,
      req.user.email,
    );
  }

  // API(/record/getDaysRecords/:days)
  @Get('getDaysRecords/:days')
  async getDaysRecords(@Param('days', ParseIntPipe) days = 7, @Request() req) {
    if (!Number.isInteger(days) || days <= 0) {
      throw new BadRequestException('Invalid days');
    }
    switch (days) {
      case 7:
        return this.recordService.findLast7DaysRecords(req.user.email);
      case 30:
        return this.recordService.findLast30DaysRecords(req.user.email);
      case 90:
        return this.recordService.findLast90DaysRecords(req.user.email);
      case 180:
        return this.recordService.findLast180DaysRecords(req.user.email);
      case 365:
        return this.recordService.findLast365DaysRecords(req.user.email);
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
          req.user.email,
        );
      case 30:
        return this.recordService.findAllLast30DaysCategoriesTotal(
          req.user.email,
        );
      case 90:
        return this.recordService.findAllLast90DaysCategoriesTotal(
          req.user.email,
        );
      case 180:
        return this.recordService.findAllLast180DaysCategoriesTotal(
          req.user.email,
        );
      case 365:
        return this.recordService.findAllLast365DaysCategoriesTotal(
          req.user.email,
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
      req.user.email,
    );
  }

  // API(/record/:id)
  @Put('update/:id')
  updateRecord(
    @Body() updateRecordDto: UpdateRecordDto,
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.recordService.updateRecord(updateRecordDto, id, req.user.email);
  }

  // API(/record/:id)
  @Delete('delete/:id')
  deleteRecord(@Param('id') id: string, @Request() req) {
    return this.recordService.deleteRecord(id, req.user.email);
  }
}
