import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, OneToOne} from "typeorm";
import { Player } from "./Player";
import { Game } from "./Game";

@Entity()
export class Ship extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;
    
    @OneToOne(type => Player)
    player: Player;

    @OneToOne(type => Game)
    game: Game

    @Column()
    size: number

    //@Column()
    //position: 

    //@Column()
    //rotation: number

}
