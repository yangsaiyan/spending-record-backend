import { Injectable, NotFoundException } from '@nestjs/common';
import { Like, Repository, Between, In, ILike } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron } from '@nestjs/schedule';
import { Record } from './record.entity';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { RecordFilterDto } from './dto/search-record.dto';

@Injectable()
export class RecordService {
  constructor(
    @InjectRepository(Record)
    private readonly recordRepository: Repository<Record>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
  ) {}

  async createRecord(createRecordDto: CreateRecordDto, email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (createRecordDto.isMonthly) {
      createRecordDto.lastTriggeredDate = new Date(
        createRecordDto.date,
      ).toISOString();
    }

    const record = this.recordRepository.create({
      ...createRecordDto,
      user: user,
    });
    return this.recordRepository.save(record);
  }

  async findAllRecords(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.recordRepository.find({ where: { user: { id: user.id } } });
  }

  async findAllRecordsPaginated(page: number, limit: number, email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [records, total] = await this.recordRepository.findAndCount({
      where: { user: { id: user.id } },
      skip: (page - 1) * limit,
      take: limit,
      order: { date: 'DESC' },
    });
    const totalPages = Math.ceil(total / limit);
    return { records, total, totalPages };
  }

  async findDaysRecords(email: string, days: number) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const now = new Date();
    const daysAgo = new Date();
    daysAgo.setDate(now.getDate() - days);

    return this.recordRepository.find({
      where: { user: { id: user.id }, date: Between(daysAgo, now) },
    });
  }

  async findDaysCategoriesTotal(email: string, days: number) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const now = new Date();
    const daysAgo = new Date();
    daysAgo.setDate(now.getDate() - days);

    const categories = await this.recordRepository.find({
      where: { user: { id: user.id }, date: Between(daysAgo, now) },
    });
    const categoriesTotal = categories.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});
    return categoriesTotal;
  }

  async findRecordByDescription(description: string, email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.recordRepository.findOne({
      where: { description: Like(`%${description}%`), user: { id: user.id } },
    });
  }

  async updateRecord(
    updateRecordDto: UpdateRecordDto,
    id: string,
    email: string,
  ) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.recordRepository.update(
      { id, user: { id: user.id } },
      updateRecordDto,
    );
  }

  async deleteRecord(id: string, email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.recordRepository.delete({ id, user: { id: user.id } });
  }

  async getFilteredRecords(email: string, filterDto: RecordFilterDto) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let categoryArray: number[] = [];
    if (Array.isArray(filterDto.category)) {
      categoryArray = filterDto.category.map(Number);
    } else if (typeof filterDto.category === 'string') {
      categoryArray = filterDto.category.split(',').map(Number);
    }

    const filter = {
      startDate: filterDto?.startDate
        ? new Date(filterDto.startDate)
        : new Date(new Date().setDate(new Date().getDate() - 365)),
      endDate: filterDto?.endDate
        ? (() => {
            const end = new Date(filterDto.endDate);
            end.setHours(23, 59, 59, 999);
            return end;
          })()
        : (() => {
            const end = new Date();
            end.setHours(23, 59, 59, 999);
            return end;
          })(),
      category: categoryArray,
      description: filterDto?.description ? filterDto.description : '',
    };

    const where: any = {
      user: { id: user.id },
      date: Between(filter.startDate, filter.endDate),
    };
    if (filter.category.length > 0) {
      where.category = In(filter.category);
    }
    if (filter.description && filter.description.trim() !== '') {
      where.description = ILike(`%${filter.description}%`);
    }

    const [records, total] = await this.recordRepository.findAndCount({
      where,
      skip: ((filterDto.page || 1) - 1) * (filterDto.limit || 5),
      take: filterDto.limit || 5,
      order: { date: 'DESC' },
    });
    const totalPages = Math.ceil(total / (filterDto.limit || 5));
    return { records, total, totalPages };
  }

  async getMonthlyRecords(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.recordRepository.find({
      where: { user: { id: user.id }, isMonthly: true },
    });
  }

  @Cron('0 0 * * *', {
    timeZone: 'Asia/Singapore',
  })
  async handleMonthlyRecords() {
    const monthlyRecords = await this.recordRepository.find({
      where: { isMonthly: true },
    });
    for (const record of monthlyRecords) {
      await this.addMonthlyRecords(record);
    }
  }

  async addMonthlyRecords(monthlyRecord: Record) {
    const now = new Date();

    if (!monthlyRecord.isMonthly) return;

    const lastTriggeredDate = new Date(monthlyRecord.lastTriggeredDate);

    const monthsDiff = now.getMonth() - lastTriggeredDate.getMonth();
    const yearsDiff = now.getFullYear() - lastTriggeredDate.getFullYear();

    if (monthsDiff < 1 && (monthsDiff !== 0 || yearsDiff === 0)) return;

    const newRecord = this.recordRepository.create({
      amount: monthlyRecord.amount,
      category: monthlyRecord.category,
      description: monthlyRecord.description,
      date: new Date(
        now.getFullYear(),
        now.getMonth(),
        monthlyRecord.date.getDate(),
      ).toISOString(),
      isMonthly: true,
      lastTriggeredDate: now,
      user: monthlyRecord.user,
    });

    await this.recordRepository.save(newRecord);

    monthlyRecord.lastTriggeredDate = now;
    monthlyRecord.isMonthly = false;
    await this.recordRepository.save(monthlyRecord);
  }
}
