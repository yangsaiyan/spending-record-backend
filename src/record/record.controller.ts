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
import { RecordFilterDto } from './dto/search-record.dto';

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
    return this.recordService.findDaysRecords(req.user.email, days);
  }

  // API(/record/getDaysTotalByCategory/:days)
  @Get('getDaysTotalByCategory/:days')
  getDaysTotalByCategory(
    @Request() req,
    @Param('days', ParseIntPipe) days = 7,
  ) {
    if (!Number.isInteger(days) || days <= 0) {
      throw new BadRequestException('Invalid days');
    }
    return this.recordService.findDaysCategoriesTotal(req.user.email, days);
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

  // API(/record/update/:id)
  @Put('update/:id')
  updateRecord(
    @Body() updateRecordDto: UpdateRecordDto,
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.recordService.updateRecord(updateRecordDto, id, req.user.email);
  }

  // API(/record/delete/:id)
  @Delete('delete/:id')
  deleteRecord(@Param('id') id: string, @Request() req) {
    return this.recordService.deleteRecord(id, req.user.email);
  }

  // API(/record/getFilteredRecords)
  @Get('getFilteredRecords')
  getFilteredRecords(@Request() req, @Query() filterDto: RecordFilterDto) {
    return this.recordService.getFilteredRecords(req.user.email, filterDto);
  }

  // API(/record/deactivateMonthlyRecord/:id)
  @Put('deactivateMonthlyRecord/:id')
  deactivateMonthlyRecord(@Param('id') id: string) {
    return this.recordService.deactivateMonthlyRecord(id);
  }

  // API(/record/getMonthlyRecords)
  @Get('getMonthlyRecords')
  getMonthlyRecords(@Request() req) {
    return this.recordService.getMonthlyRecords(req.user.email);
  }
}
