import { User } from 'src/user/user.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Otp {
  @PrimaryGeneratedColumn('uuid')
  otpId: string;

  @OneToOne(() => User, (user) => user.otp)
  @JoinColumn()
  user: User;

  @Column()
  otp: string;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  triggeredAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  deletedAt: Date;
}
