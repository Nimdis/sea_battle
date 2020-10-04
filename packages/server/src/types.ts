import { Request } from 'express'
import { Socket } from 'socket.io'

import { Game } from './entities/Game'
import { Player } from './entities/Player'

interface ParamsDictionary {
    [key: string]: string
}

export interface IReq<
    P extends ParamsDictionary = ParamsDictionary,
    ResBody = any,
    ReqBody = any,
    ReqQuery = {}
> extends Request<P, ResBody, ReqBody, ReqQuery> {
    game: Game
    player: Player
}

export interface ISocket extends Socket {
    game: Game
    player: Player
}