import { RequestHandler } from 'express'

import { IReq } from './types'
import { Game } from './entities/Game'
import { Player } from './entities/Player'

export const attachGame: RequestHandler = async (req: IReq, res, next) => {
    const token = req.headers['x-game']
    
    const game = await Game.findOne({
        where: {
            token
        },
        relations: ['players']
    })

    if (!game) {
        return res.status(401).send()
    }

    req.game = game
    next()
}

export const attachPlayer: RequestHandler = async (req: IReq, res, next) => {
    const playerToken = req.headers['x-auth-player']
    const { game } = req

    if (playerToken) {
        const player = await Player.findOne({
            where: {
                token: playerToken
            },
            relations: ['ships', 'cellsStore']
        })
        if (!player) {
            return res.status(401).send()
        }
        req.player = player
        next()
        return 
    }

    const player = new Player()
    player.game = game
    await player.save()
    req.player = (await Player.findOne({
        where: {
            token: player.token
        },
        relations: ['ships', 'cellsStore']
    }))!
    next()
}