import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    BaseEntity,
    OneToOne,
    ManyToOne,
} from 'typeorm'
import { Game } from './Game'
import { Player } from './Player'
import { TCells } from '../logic/CellsStore'

@Entity()
export class CellsStore extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'json' })
    cells: TCells

    @ManyToOne((type) => Game, { nullable: false })
    @JoinColumn()
    game: Game

    @OneToOne((type) => Player, { nullable: false })
    @JoinColumn()
    player: Player
}
