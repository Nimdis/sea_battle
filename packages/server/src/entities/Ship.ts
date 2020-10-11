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
import { TPosition, TRotation, TShipSize, IShip } from '../logic/ship'

export const shipToIShip = (ship: Ship) => {
    return {size: ship.size,
            position: ship.position,
            rotation: ship.rotation,
            num: 0} as IShip
}

export const shipsToIShips = (ships: Ship[]) => {
    const iShips: IShip[] = []
    for (const ship of ships) {
        iShips.push(shipToIShip(ship))
    }
    return iShips
}

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

    @Column()
    health: number
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
