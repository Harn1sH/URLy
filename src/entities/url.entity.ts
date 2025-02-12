import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Analytics } from "./analytics.entity";
import { User } from "./user.entity";

@Entity()
export class Url {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  alias: string;

  @Column()
  longUrl: string;

  @Column({ nullable: true })
  topic: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @OneToOne(() => Analytics, { nullable: true, cascade: true, onDelete: "SET NULL" })
  @JoinColumn()
  analytics: Analytics;

  @ManyToOne(() => User, (user) => user.url)
  user: User;
}
