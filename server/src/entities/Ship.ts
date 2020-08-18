import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne} from "typeorm";
import { Player } from "./Player";
import { Game } from "./Game";
import { TPosition, TRotation, TShipSize } from "../logic/ship"

@Entity()
export class Ship extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;
    
    @ManyToOne(type => Game, game => game.ships)
    game: Game

    @ManyToOne(type => Player, player => player.ships)
    player: Player

    @Column()
    size: TShipSize

    @Column({ type: 'json' })
    position: TPosition

    @Column({ type: 'json' })
    rotation: TRotation
}
