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
import { Ship, buildInsert } from './entities/Ship'
import { CellsStore } from './entities/CellsStore'

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

app.get('/ships', async (req, res) => {
    const player = await Player.findOne({ 
        where: { 
            token: req.headers['x-auth-player'] 
        }, 
        relations: ['game', 'ships', 'cellsStore'] 
    })

    if (!player) {
        return res.status(401)
    }

    if (player.ships.length && player.cellsStore?.cells) {
        return res.json({
            ships: player.ships,
            cells: player.cellsStore?.cells
        })
    }
    const shipManager = new ShipManager()
    const ships: IShip[] = shipManager.randomPlaceShips()

    const shipsToInsert = ships.map(ship => {
        return Ship.create({
            game: player.game,
            player: player,
            position: ship.position,
            rotation: ship.rotation,
            size: ship.size
        })
    })

    const cellsStore = await CellsStore.create({
        player: player,
        game: player.game,
        cells: shipManager.getCells()
    }).save()

    res.json({
        ships: await buildInsert(shipsToInsert),
        cells: cellsStore.cells
    })
})

const run = async () => {
    await createConnection()
    http.listen(4000)
    console.log('started..')
}

run()