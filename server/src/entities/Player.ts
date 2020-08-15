import {Generated, Column, Entity, OneToMany, PrimaryGeneratedColumn, BaseEntity, ManyToOne} from "typeorm";
import { Game } from "./Game";
import { Ship } from "./Ship";

@Entity()
export class Player extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(type => Game, game => game.players)
    game: Game

    @Column()
    @Generated('uuid')
    token: string

    @OneToMany(type => Ship, ship => ship.game)
    ships: Ship[]

}
