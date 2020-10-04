import { RequestHandler } from 'express'
import diffInSec from 'date-fns/fp/differenceInSeconds'

import { IReq } from '../types'
import { PlayerTurn } from '../entities/PlayerTurn'
import { ECellTurnType } from '../logic/CellsStore'
import { Player } from '../entities/Player'

export const turn: RequestHandler = async (req: IReq, res) => {
    // req destruction
    const { game, player } = req

    // is enemy online
    let isEnemyOnline = false
    const [enemyPlayer] = game.players.filter((p) => p.id !== player.id)
    if (enemyPlayer) {
        const diff = diffInSec(enemyPlayer.lastVisitAt, new Date())
        if (diff < 40) {
            isEnemyOnline = true
        }
    }

    // request turns form DB
    const turns = await PlayerTurn.findTurnsByGame(game)
    const [playerTurn] = turns

    const isMyTurn = game.isMyTurn(player, playerTurn)

    // update last visit
    player.lastVisitAt = new Date()
    await player.save()

    // calc winner by shots
    let playerShots = 0
    let enemyShots = 0
    for (const turn of turns) {
        if (turn.type == ECellTurnType.hitted) {
            if (turn.player.id === player.id) {
                playerShots++
            } else {
                enemyShots++
            }
        }
    }

    // send response
    if (playerShots < 20 && enemyShots < 20) {
        res.json({
            isEnemyOnline,
            isMyTurn,
            turns,
        })
    } else {
        const winner: string = playerShots >= 20 ? 'me' : 'enemy'
        res.json({
            isEnemyOnline,
            isMyTurn,
            turns,
            winner,
        })
    }
}
