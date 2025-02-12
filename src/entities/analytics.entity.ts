import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Url } from "./url.entity";
import { json } from "stream/consumers";

export type ClicksByDate = {
  date: string;
  clickCount: number;
};

export type OsType = {
  osName: string;
  uniqueClicks: number;
  uniqueUsers: number;
};

export type DeviceType = {
  deviceName: string;
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
  clicksByDate: ClicksByDate[];

  @Column({ type:'json' })
  osType: OsType[];

  @Column({ type:'json' })
  deviceType: DeviceType[];
}
