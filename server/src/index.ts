import "reflect-metadata"
import socket from 'socket.io'
import { createConnection } from "typeorm"
import { createServer } from 'http'
import server from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import { ShipManager, IShip } from './logic/ship' 
// import { attachGame, attachPlayer } from './middlewares'

import { Game } from './entities/Game'
import { Player } from './entities/Player'
import { Ship } from './entities/Ship'
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from "constants"

const app = server()
const http = createServer(app)

app.use(bodyParser.json())
app.use(cors())

const io = socket(http)

app.post('/new_game', async (_req, res) => {
    const game = new Game()
    await game.save()

    const player = new Player()
    player.game = game
    await player.save()
        
    res.json({
        token: game.token,
        playerToken: player.token
    })
})

app.get('/ships', (req, res) => {
    let ships: IShip[] = [];
    Player.findOne({ where: {token: req.headers['x-auth-player']}}).then(async player => {
        const field = new ShipManager()
        let i = 0
        while(true){
            i++
            if(Math.random()<0.5){
                field.rotateCurrentShip()
            }
            if(field.addShipByPostion(Math.floor(Math.random()*10), Math.floor(Math.random()*10))){
                //ships.push(field.getCurrentShip())
                const ship = new Ship()
                ship.player = player
                ship.game = player.game
                ship.position = field.getCurrentShip().position
                ship.rotation = field.getCurrentShip().rotation
                ship.size = field.getCurrentShip().size
                await ship.save()
                if(field.getCurrentShip().num == 4){
                    break
                }
            }
        }
    })
    // TODO write algorythm for random ships
    // Save ships to DB
    // Sent ships to client
    res.json({
        ships: ships
    })
})

const run = async () => {
    await createConnection()
    http.listen(4000)
    console.log('started..')
}

run()