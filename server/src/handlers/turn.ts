import { RequestHandler } from "express"
import diffInSec from 'date-fns/fp/differenceInSeconds'

import { IReq } from '../types'
import { PlayerTurn } from "../entities/PlayerTurn"

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

    game.numOfFirstPlayer
    game.players.length === 2

    let isMyTurn = false

    if (game.players.length === 2 && !Boolean(playerTurn)) {
        isMyTurn = game.players.sort((a, b) => a.id - b.id)[game.numOfFirstPlayer].id === player.id
    } else {
        isMyTurn = Boolean(playerTurn) && playerTurn.player.id !== player.id
    }

    player.lastVisitAt = new Date()
    await player.save()

    res.json({
        isEnemyOnline,
        isMyTurn,
        turns
    })
}