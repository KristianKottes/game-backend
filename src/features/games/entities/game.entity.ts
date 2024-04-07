import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { GameStatus } from '../../common/enums';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'games' })
export class Game extends BaseEntity {
  constructor(partial: Partial<Game>) {
    super();
    Object.assign(this, partial);
  }

  @PrimaryColumn({ type: 'uuid', generated: 'uuid' })
  id: string;

  @Column({ type: 'uuid', unique: false })
  owner_id: string;

  @Column({ type: 'uuid', nullable: true, unique: false })
  member_id: string | null;

  @Column({ type: 'uuid', nullable: true, unique: false })
  current_turn_user_id: string | null;

  @Column({ type: 'uuid', nullable: true, unique: false })
  winner_id: string | null;

  @Column({
    type: 'enum',
    enum: GameStatus,
    default: GameStatus.Waiting,
  })
  status: GameStatus;

  @Column({
    type: 'int',
    default: [],
    array: true,
  })
  maze: number[][][];

  @OneToOne(() => User)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @OneToOne(() => User)
  @JoinColumn({ name: 'member_id' })
  member: User | null;

  @OneToOne(() => User)
  @JoinColumn({ name: 'current_turn_user_id' })
  currentTurnUser: User | null;

  @OneToOne(() => User)
  @JoinColumn({ name: 'winner_id' })
  winner: User | null;
}
