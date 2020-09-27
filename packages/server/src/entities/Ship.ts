import {
    Entity,
    JoinColumn,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    ManyToOne,
    getConnection,
} from 'typeorm'
import { Player } from './Player'
import { Game } from './Game'
import { TPosition, TRotation, TShipSize } from '../logic/ship'

@Entity()
export class Ship extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne((type) => Game, (game) => game.ships, { nullable: false })
    @JoinColumn()
    game: Game

    @ManyToOne((type) => Player, (player) => player.ships, { nullable: false })
    @JoinColumn()
    player: Player

    @Column()
    size: TShipSize

    @Column({ type: 'json' })
    position: TPosition

    @Column({ type: 'json' })
    rotation: TRotation
}

export const buildInsert = async (ships: Ship[]): Promise<Ship[]> => {
    if (!ships.length) {
        return ships
    }

    await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Ship)
        .values(ships)
        .execute()

    const [ship] = ships

    return await Ship.find({
        where: {
            player: ship.player,
            game: ship.game,
        },
    })
}
