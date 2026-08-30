import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  @Column({
    name: 'created_by',
    type: 'uuid',
    nullable: true,
  })
  createdBy: string | null;

  @Column({
    name: 'updated_by',
    type: 'uuid',
    nullable: true,
  })
  updatedBy: string | null;

  @DeleteDateColumn({
    name: 'deleted_at',
    nullable: true,
  })
  deletedAt: Date | null;
}
