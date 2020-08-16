import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne} from "typeorm";
import { Player } from "./Player";
import { Game } from "./Game";

export type TPosition = {
    i: number
    j: number
}

export type TRotationUnit = 0 | 1

export type TRotation = {
    i: TRotationUnit
    j: TRotationUnit
}

@Entity()
export class Ship extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;
    
    @ManyToOne(type => Game, game => game.ships)
    game: Game

    @ManyToOne(type => Player, player => player.ships)
    player: Player

    @Column()
    size: number

    @Column({ type: 'json' })
    position: TPosition

    @Column({ type: 'json' })
    rotation: TRotation
}
