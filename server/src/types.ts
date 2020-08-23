import { Request } from 'express'

import { Game } from './entities/Game'
import { Player } from './entities/Player'

interface ParamsDictionary { [key: string]: string; }

export interface IReq<
    P extends ParamsDictionary = ParamsDictionary, 
    ResBody = any, 
    ReqBody = any, 
    ReqQuery = {}
> extends Request<P, ResBody, ReqBody, ReqQuery> {
    game: Game
    player: Player
}