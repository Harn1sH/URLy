import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Url } from "./url.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  googleID: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @OneToMany(() => Url, (url) => url.user)
  url: Url[];
}
