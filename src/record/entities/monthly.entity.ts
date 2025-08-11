import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Monthly {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.records)
  user: User;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  amount: number;

  @Column()
  category: number;

  @Column()
  description: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  lastTriggeredDate: Date;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
