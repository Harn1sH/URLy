import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Url {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({unique: true})
  alias: string;

  @Column()
  longUrl: string;

  @Column({nullable: true})
    topic: string

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}
