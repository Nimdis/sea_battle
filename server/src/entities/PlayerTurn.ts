import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne} from "typeorm";
import { Game } from "./Game"
import { Player } from "./Player"

@Entity()
export class PlayerTurn extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    //@Column()
    //position: string;

    @OneToOne(type => Game)
    game: Game

    @OneToOne(type => Player)
    player: Player

}
