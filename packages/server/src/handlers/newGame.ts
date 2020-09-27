
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

/*export const SnewGame = async (socket, io, token, playerToken) => {
    if(token){
        const game = await Game.findOne({
            where: {
                token
            },
            relations: ['players']
        })
        if(game && game.players.length < 2){
            socket.join(token)
            const player = new Player()
            player.game = game
            await player.save()
            socket.emit('new_game', game.token, player.token)
            io.to(token).emit('enemyOnline');
        }
        return
    }

    const game = new Game()
    await game.save()

    const player = new Player()
    player.game = game
    await player.save()

    socket.join(player.token)

    socket.emit('new_game', game.token, player.token)
}*/