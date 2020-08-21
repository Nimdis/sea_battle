import {Generated, JoinColumn, Column, Entity, OneToMany, PrimaryGeneratedColumn, BaseEntity, OneToOne, ManyToOne} from "typeorm";

import { Game } from "./Game";
import { Ship } from "./Ship";
import { CellsStore } from "./CellsStore";

@Entity()
export class Player extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(type => Game, game => game.players, { nullable: false })
    @JoinColumn()
    game: Game

    @Column()
    @Generated('uuid')
    token: string

    @OneToMany(type => Ship, ship => ship.game)
    ships: Ship[]

    @OneToOne(type => CellsStore, ship => ship.player)
    cellsStore?: CellsStore

}
