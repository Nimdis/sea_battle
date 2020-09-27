import { Router, Express } from 'express'

import { attachGame, attachPlayer } from './middlewares'
import { newGame } from './handlers/newGame'
import { ships } from './handlers/ships'
import { turn } from './handlers/turn'
import { fire } from './handlers/fire'

export const routes = (app: Express) => {
    const gameRouter = Router()

    gameRouter.use(attachGame)
    gameRouter.use(attachPlayer)

    app.post('/new_game', newGame)

    gameRouter.get('/turn', turn)
    //gameRouter.post('/fire', fire)
    gameRouter.get('/ships', ships)

    app.use(gameRouter)
}
