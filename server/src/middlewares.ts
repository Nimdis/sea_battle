import { ISocket } from './types'
import { Game } from "./entities/Game";
import { Player } from "./entities/Player";

export const attachGame = async (s: ISocket, next) => {
    const { token } = s.handshake.query
    s.game = await Game.findOne({ where: { token } })
    next()
}

export const attachPlayer = async (s: ISocket, next)  => {
    const { playerToken } = s.handshake.query
    s.player = await Player.findOne({ where: { token: playerToken } })
    next()
}