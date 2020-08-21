import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, CreateDateColumn, Generated} from "typeorm";
import { Player } from "./Player";
import { Ship } from "./Ship";
import { CellsStore } from "./CellsStore";

@Entity()
export class Game extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    @Generated('uuid')
    token: string

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(type => Player, player => player.game)
    players: Player[]

    @OneToMany(type => Ship, ship => ship.game)
    ships: Ship[]

    @OneToMany(type => CellsStore, cells => cells.game)
    cellsStores: CellsStore[]
}
