import { User } from 'src/user/user.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Otp {
  @OneToOne(() => User, (user) => user.otp)
  user: User;

  @Column()
  otp: string;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  triggeredAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  deletedAt: Date;
}
