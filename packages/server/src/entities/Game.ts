import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    OneToMany,
    CreateDateColumn,
    Generated,
} from 'typeorm'
import { Player } from './Player'
import { Ship } from './Ship'
import { CellsStore } from './CellsStore'
import { PlayerTurn } from './PlayerTurn'

@Entity()
export class Game extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: string

    @Column()
    @Generated('uuid')
    token: string

    @CreateDateColumn()
    createdAt: Date

    @OneToMany((type) => Player, (player) => player.game)
    players: Player[]

    // required for first turn
    @Column()
    numOfFirstPlayer: 0 | 1 = Math.random() > 0.5 ? 0 : 1

    @OneToMany((type) => Ship, (ship) => ship.game)
    ships: Ship[]

    @OneToMany((type) => CellsStore, (cells) => cells.game)
    cellsStores: CellsStore[]

    @OneToMany((type) => PlayerTurn, (turn) => turn.game)
    turns: PlayerTurn[]

    isMyTurn(player: Player, lastTurn: PlayerTurn) {
        if (this.players.length === 2) {
            if (!lastTurn) {
                if(this.numOfFirstPlayer === 1){
                    return player.id > this.players[0].id || player.id > this.players[1].id
                }
                return player.id < this.players[0].id || player.id < this.players[1].id
            } else {
                return lastTurn.player.id !== player.id
            }
        }
        return false
    }
}
