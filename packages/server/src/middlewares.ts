import { RequestHandler } from 'express'

import { IReq, ISocket } from './types'
import { Game } from './entities/Game'
import { Player } from './entities/Player'
import { Socket } from 'socket.io'

const attachGameIsomorphic = async (
    obj: any,
    next,
    onError: () => void,
    token?: string
) => {
    if (!token) {
        return onError()
    }

    const game = await Game.findOne({
        where: {
            token,
        },
        relations: ['players'],
    })

    if (!game) {
        return onError()
    }

    obj.game = game
    next()
}

export const attachGame: RequestHandler = (req: IReq, res, next) =>
    attachGameIsomorphic(
        req,
        next,
        () => res.status(401).send(),
        req.headers['x-game'] as string | undefined
    )

export const attachGameIO = (socket: Socket, next) =>
    attachGameIsomorphic(
        socket,
        next,
        () => socket.disconnect(),
        socket.handshake.query.token
    )

const attachPlayerIsomorphic = async (
    obj: any,
    next,
    onError: () => void,
    game: Game,
    token?: string
) => {
    if (token) {
        const player = await Player.findOne({
            where: {
                token
            },
            relations: ['ships', 'cellsStore'],
        })
        if (!player) {
            return onError()
        }
        obj.player = player
        next()
        return
    }

    const player = new Player()
    player.game = game
    await player.save()
    obj.player = (await Player.findOne({
        where: {
            token: player.token,
        },
        relations: ['ships', 'cellsStore'],
    }))!
    next()
}

export const attachPlayerIO = (socket: ISocket, next: any) => attachPlayerIsomorphic(socket, next, () => socket.disconnect(), socket.game, socket.handshake.query.playerToken)

export const attachPlayer: RequestHandler = async (req: IReq, res, next) => attachPlayerIsomorphic(req, next, () => res.status(401).send(), req.game, req.headers['x-auth-player'] as string | undefined)
