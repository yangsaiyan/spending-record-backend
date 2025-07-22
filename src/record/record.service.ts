import { Injectable, NotFoundException } from '@nestjs/common';
import { LessThanOrEqual, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Record } from './record.entity';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { User } from 'src/user/user.entity';

@Injectable()
export class RecordService {
  constructor(
    @InjectRepository(Record)
    private readonly recordRepository: Repository<Record>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createRecord(createRecordDto: CreateRecordDto, email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const record = this.recordRepository.create({
      ...createRecordDto,
      user: user,
    });
    return this.recordRepository.save(record);
  }

  async findAllRecords(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.recordRepository.find({ where: { user: { id: user.id } } });
  }

  async findAllRecordsPaginated(page: number, limit: number, email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
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

  async findLast7DaysRecords(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return this.recordRepository.find({
      where: { user: { id: user.id }, date: LessThanOrEqual(sevenDaysAgo) },
    });
  }

  async findLast30DaysRecords(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return this.recordRepository.find({
      where: { user: { id: user.id }, date: LessThanOrEqual(thirtyDaysAgo) },
    });
  }

  async findLast90DaysRecords(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    return this.recordRepository.find({
      where: { user: { id: user.id }, date: LessThanOrEqual(ninetyDaysAgo) },
    });
  }

  async findLast180DaysRecords(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const oneHundredEightyDaysAgo = new Date();
    oneHundredEightyDaysAgo.setDate(oneHundredEightyDaysAgo.getDate() - 180);
    return this.recordRepository.find({
      where: {
        user: { id: user.id },
        date: LessThanOrEqual(oneHundredEightyDaysAgo),
      },
    });
  }

  async findLast365DaysRecords(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const threeHundredSixtyFiveDaysAgo = new Date();
    threeHundredSixtyFiveDaysAgo.setDate(
      threeHundredSixtyFiveDaysAgo.getDate() - 365,
    );
    return this.recordRepository.find({
      where: {
        user: { id: user.id },
        date: LessThanOrEqual(threeHundredSixtyFiveDaysAgo),
      },
    });
  }

  async findAllLast7DaysCategoriesTotal(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const categories = await this.recordRepository.find({
      where: { user: { id: user.id }, date: LessThanOrEqual(sevenDaysAgo) },
    });
    const categoriesTotal = categories.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});
    return categoriesTotal;
  }

  async findAllLast30DaysCategoriesTotal(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const categories = await this.recordRepository.find({
      where: { user: { id: user.id }, date: LessThanOrEqual(thirtyDaysAgo) },
    });
    const categoriesTotal = categories.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});
    return categoriesTotal;
  }

  async findAllLast90DaysCategoriesTotal(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const categories = await this.recordRepository.find({
      where: { user: { id: user.id }, date: LessThanOrEqual(ninetyDaysAgo) },
    });
    const categoriesTotal = categories.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});
    return categoriesTotal;
  }

  async findAllLast180DaysCategoriesTotal(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const oneHundredEightyDaysAgo = new Date();
    oneHundredEightyDaysAgo.setDate(oneHundredEightyDaysAgo.getDate() - 180);
    const categories = await this.recordRepository.find({
      where: {
        user: { id: user.id },
        date: LessThanOrEqual(oneHundredEightyDaysAgo),
      },
    });
    const categoriesTotal = categories.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});
    return categoriesTotal;
  }

  async findAllLast365DaysCategoriesTotal(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const threeHundredSixtyFiveDaysAgo = new Date();
    threeHundredSixtyFiveDaysAgo.setDate(
      threeHundredSixtyFiveDaysAgo.getDate() - 365,
    );
    const categories = await this.recordRepository.find({
      where: {
        user: { id: user.id },
        date: LessThanOrEqual(threeHundredSixtyFiveDaysAgo),
      },
    });
    const categoriesTotal = categories.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});
    return categoriesTotal;
  }

  async findRecordByDescription(description: string, email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
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
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.recordRepository.update(
      { id, user: { id: user.id } },
      updateRecordDto,
    );
  }

  async deleteRecord(id: string, email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.recordRepository.delete({ id, user: { id: user.id } });
  }
}
