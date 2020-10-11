import { RequestHandler } from 'express'

import { IReq } from '../types'
import { IShip, ShipManager } from '../logic/ship'
import { Ship, buildInsert, shipsToIShips } from '../entities/Ship'
import { CellsStore } from '../entities/CellsStore'

export const ships: RequestHandler = async (req: IReq, res) => {
    const { game, player } = req

    if (!player && game.players.length === 2) {
        return res.status(401).send()
    }
    console.log(player.token)
    // TODO move player token to header
    if (player && player.ships.length && player.cellsStore?.cells) {
        return res.json({
            ships: player.ships,
            cells: player.cellsStore?.cells,
            playerToken: player.token,
        })
    }

    const shipManager = new ShipManager()
    const ships: IShip[] = shipManager.randomPlaceShips()

    const shipsToInsert = ships.map((ship) => {
        return Ship.create({
            game: game,
            player: player,
            position: ship.position,
            rotation: ship.rotation,
            size: ship.size,
            health: ship.size as number,
        })
    })

    const cellsStore = await CellsStore.create({
        player: player,
        game: game,
        cells: shipManager.getCells(),
    }).save()

    const shipsFromDb = await buildInsert(shipsToInsert)

    res.json({
        ships: shipsToIShips(shipsFromDb),
        cells: cellsStore.cells,
        playerToken: player.token,
    })
}
