import { Socket } from 'socket.io'
import { Game } from "./entities/Game";
import { Player } from "./entities/Player";

export interface ISocket extends Socket {
    game?: Game
    player?: Player
}