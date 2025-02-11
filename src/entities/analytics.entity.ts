import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Url } from "./url.entity";
import { json } from "stream/consumers";

type ClicksByDate = {
  date: string;
  clickCount: number;
};

type OsType = {
  osName: string;
  uniqueClicks: number;
  uniqueUsers: number;
};

type DeviceType = {
  deviceType: string;
  uniqueClicks: number;
  uniqueUsers: number;
};
@Entity()
export class Analytics {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  totalClicks: number;

  @Column()
  uniqueUsers: number;

  @Column({ type:'json' })
  clickByDate: ClicksByDate[];

  @Column({ type:'json' })
  osType: OsType[];

  @Column({ type:'json' })
  deviceType: DeviceType[];
}
