import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";

@Entity()
export class Player extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    token: string;

}
