import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Game } from '../../games/entities/game.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'messages' })
export class Message extends BaseEntity {
  constructor(partial: Partial<Message>) {
    super();
    Object.assign(this, partial);
  }

  @PrimaryColumn({ type: 'uuid', generated: 'uuid' })
  id: string;

  @Column({ type: 'uuid', unique: false, nullable: false })
  sender_id: string;

  @Column({ type: 'uuid', nullable: false, unique: false })
  recipient_id: string;

  @Column({ type: 'uuid', nullable: false, unique: false })
  game_id: string;

  @Column()
  text: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => User)
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @OneToOne(() => User)
  @JoinColumn({ name: 'recipient_id' })
  recipient: User;

  @OneToOne(() => Game)
  @JoinColumn({ name: 'game_id' })
  game: Game;
}
