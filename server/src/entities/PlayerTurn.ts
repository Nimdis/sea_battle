import {CreateDateColumn, Column, Entity, PrimaryGeneratedColumn, JoinColumn, BaseEntity, OneToOne} from "typeorm";

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

    @OneToOne(type => Game, { nullable: false })
    @JoinColumn()
    game: Game

    @OneToOne(type => Player, { nullable: false })
    @JoinColumn()
    player: Player

    @Column()
    type: ECellTurnType

    @CreateDateColumn()
    createdAt: Date;
}
