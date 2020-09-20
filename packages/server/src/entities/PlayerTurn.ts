import {CreateDateColumn, Column, Entity, PrimaryGeneratedColumn, JoinColumn, BaseEntity, OneToOne, ManyToOne} from "typeorm";

import { Game } from "./Game"
import { Player } from "./Player"

import { TPosition } from "../logic/ship"
import { ECellTurnType } from "../logic/CellsStore"

@Entity()
export class PlayerTurn extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'json' })
    position: TPosition

    @ManyToOne(type => Game, game => game.turns, { nullable: false })
    @JoinColumn()
    game: Game

    @ManyToOne(type => Player, player => player.turns, { nullable: false })
    @JoinColumn()
    player: Player

    @Column()
    type: ECellTurnType

    @CreateDateColumn()
    createdAt: Date;
}
