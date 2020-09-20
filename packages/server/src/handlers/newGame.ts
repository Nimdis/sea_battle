import { RequestHandler } from 'express'

import { Game } from '../entities/Game'
import { Player } from '../entities/Player'

export const newGame: RequestHandler = async (_req, res) => {

    const game = new Game()
    await game.save()

    const player = new Player()
    player.game = game
    await player.save()
    
    res.json({
        token: game.token,
        playerToken: player.token
    })
}