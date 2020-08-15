import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne} from "typeorm";
import { Player } from "./Player";
import { PlayerTurn }  from "./PlayerTurn"

@Entity()
export class Game extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @OneToOne(type => Player)
    created_at: Player;

}
