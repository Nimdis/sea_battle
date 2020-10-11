import { RequestHandler } from 'express'

import { IReq } from '../types'
import { PlayerTurn } from '../entities/PlayerTurn'
import { CellsStore } from '../entities/CellsStore'
import { Game } from '../entities/Game'
import { shipToIShip, Ship } from '../entities/Ship'
import { Player } from '../entities/Player'
import { ECellType, ECellTurnType } from '../logic/CellsStore'
import { ShipManager, IShip, TShipSize } from '../logic/ship'

// req с номером ячейки (i,j) после чего просиходит новый ход + на поле помечается ячейка как та в которую сходили
export const fire = async (token, playerToken, i, j) => {

    const game = await Game.findOne({
        where: {
            token,
        },
        relations: ['players', 'ships'],
    })

    const player = await Player.findOne({
        where: {
            token: playerToken,
        },
    })

    if (!game || !player) {
        return
    }
    const turns = await PlayerTurn.findTurnsByGame(game)

    const enemyToken = game.players.filter((p) => p.id !== player.id)[0].token

    if(!enemyToken){
        return
    }

    const enemy = await Player.findOne({
        where: {
            token: enemyToken,
        },
        relations: ['ships'],
    })
    const enemyCells = await CellsStore.findOne({
        where: {
            player: enemy,
        },
    })
    const enemyShips = enemy!.ships

    if (!enemyCells) {
        return
    }

    if (i > 9 || i < 0 || j > 9 || j < 0) {
        return
    }
    
    const [lastTurn] = turns
    if (!game.isMyTurn(player, lastTurn)) {
        return
    }
    
    const { cells } = enemyCells

    if (cells[i][j] === ECellType.missed || 
        cells[i][j] === ECellType.hitted ||
        cells[i][j] === ECellType.killed) {
        return
    }
    
    const turn = new PlayerTurn()
    turn.player = player
    turn.game = game
    turn.position = { i: i, j: j }
    let shipCollision: Ship | undefined;
    if (cells[i][j] === ECellType.withShip) {
        for(const ship of enemyShips){
            if (ship.position.i > i || ship.position.j > j) {
                continue
            }

            if (ship.position.i + ship.size * (1 - ship.rotation) < i || 
                ship.position.j + ship.size * ship.rotation < j) {
                continue
            }

            shipCollision = ship

        }
        
        shipCollision!.health -= 1 
        await shipCollision!.save()

        if(shipCollision!.health == 0){
            turn.type = ECellTurnType.killed
            enemyCells.cells[i][j] = ECellType.killed
        } else {
            turn.type = ECellTurnType.hitted
            enemyCells.cells[i][j] = ECellType.hitted
        }
        
    } else {
        enemyCells.cells[i][j] = ECellType.missed
        turn.type = ECellTurnType.missed
    }
   
    await turn.save()
    await enemyCells.save()

    return {
        i, j, type: turn.type, ship: shipCollision
    }
}
