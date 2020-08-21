import {Entity, PrimaryGeneratedColumn, JoinColumn, BaseEntity, OneToOne} from "typeorm";
import { Game } from "./Game"
import { Player } from "./Player"

@Entity()
export class PlayerTurn extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    //@Column()
    //position: string;

    @OneToOne(type => Game, { nullable: false })
    @JoinColumn()
    game: Game

    @OneToOne(type => Player, { nullable: false })
    @JoinColumn()
    player: Player

}
