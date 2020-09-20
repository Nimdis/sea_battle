import { RequestHandler } from "express"
import diffInSec from 'date-fns/fp/differenceInSeconds'

import { IReq } from '../types'
import { PlayerTurn } from "../entities/PlayerTurn"
import { ECellTurnType } from "../logic/CellsStore"

export const turn: RequestHandler = async (req: IReq, res) => {
    const { game, player } = req
    let isEnemyOnline = false

    const [enemyPlayer] = game.players.filter(p => p.id !== player.id)
    if (enemyPlayer) {
        const diff = diffInSec(enemyPlayer.lastVisitAt, new Date())
        if (diff < 40) {
            isEnemyOnline = true
        }
    }

    const turns = await PlayerTurn.find({
        where: {
            game
        },
        order: {
            createdAt: 'DESC'
        },
        relations: ['player']
    })

    const [playerTurn] = turns

    let isMyTurn = false

    if (game.players.length === 2 && !Boolean(playerTurn)) {
        isMyTurn = player.id % 2 === game.numOfFirstPlayer
    } else {
        isMyTurn = Boolean(playerTurn) && playerTurn.player.id !== player.id
    }

    player.lastVisitAt = new Date()
    await player.save()

    let playerShots = 0
    let enemyShots = 0
    for (const turn of turns) {
        if(turn.type == ECellTurnType.hitted){
            if(turn.player.id === player.id){
                playerShots++
            } else {
                enemyShots++
            }
        }
    }

    if(playerShots < 20 && enemyShots < 20) {
        res.json({
            isEnemyOnline,
            isMyTurn,
            turns
        })
    } else {
        const winner: string = playerShots >= 20 ? "me" : "enemy"
        res.json({
            isEnemyOnline,
            isMyTurn,
            turns,
            winner
        })
    }
}