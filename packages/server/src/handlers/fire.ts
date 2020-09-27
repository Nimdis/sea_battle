import { RequestHandler } from 'express'

import { IReq } from '../types'
import { PlayerTurn } from '../entities/PlayerTurn'
import { CellsStore } from '../entities/CellsStore'
import { Game } from '../entities/Game'
import { Player } from '../entities/Player'
import { ECellType, ECellTurnType } from '../logic/CellsStore'

// req с номером ячейки (i,j) после чего просиходит новый ход + на поле помечается ячейка как та в которую сходили
export const fire = async (room, token, playerToken, i, j) => {
    const game = await Game.findOne({
        where: {
            token,
        },
        relations: ['players'],
    })

    const player = await Player.findOne({
        where: {
            playerToken,
        },
    })

    if (!game || !player) {
        return
    }
    const turns = await PlayerTurn.find({
        where: {
            game,
        },
        order: {
            createdAt: 'DESC',
        },
        relations: ['player'],
    })

    const enemy = game.players.filter((p) => p.id !== player.id)[0]
    const enemyCells = await CellsStore.findOne({
        where: {
            player: enemy,
        },
    })

    if (!enemyCells) {
        return
    }

    if (i > 9 || i < 0 || j > 9 || j < 0) {
        return
    }

    if (turns.length) {
        if (turns[0].player.id === player.id) {
            return
        }
    } else {
        if (player.id % 2 !== game.numOfFirstPlayer) {
            return
        }
    }

    const { cells } = enemyCells

    if (cells[i][j] === ECellType.missed || cells[i][j] === ECellType.hitted) {
        return
    }

    const turn = new PlayerTurn()
    turn.player = player
    turn.game = game
    turn.position = { i: i, j: j }

    if (cells[i][j] === ECellType.withShip) {
        enemyCells.cells[i][j] = ECellType.hitted
        turn.type = ECellTurnType.hitted
    } else {
        enemyCells.cells[i][j] = ECellType.missed
        turn.type = ECellTurnType.missed
    }

    await turn.save()
    await enemyCells.save()

    room.emit(turn.type, i, j)
}
