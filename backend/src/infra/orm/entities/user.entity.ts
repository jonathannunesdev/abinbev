import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("TB_USERS")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: "varchar", length: 255})
  name: string;

  @Column({type: "varchar", length: 255, unique: true})
  email: string;

  @Column({type: "varchar", length: 255})
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
