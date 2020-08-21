import "reflect-metadata"
import { createConnection } from "typeorm"
import { createServer } from 'http'
import server from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import { ShipManager, IShip } from './logic/ship' 

import { Game } from './entities/Game'
import { Player } from './entities/Player'
import { Ship, buildInsert } from './entities/Ship'
import { CellsStore } from './entities/CellsStore'

const app = server()
const http = createServer(app)

app.use(bodyParser.json())
app.use(cors())

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
    const playerToken = req.headers['x-auth-player']
    const token = req.headers['x-game']

    let player = await Player.findOne({ 
        where: { 
            token: playerToken 
        }, 
        relations: ['ships', 'cellsStore'] 
    })

    const game = await Game.findOne({
        where: {
            token
        },
        relations: ['players']
    })

    if (!game) {
        return res.status(404)
    }

    if (!player && game.players.length === 2) {
        return res.status(401)
    }

    if (!player) {
        player = new Player()
        player.game = game
        await player.save()
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
            game: game,
            player: player,
            position: ship.position,
            rotation: ship.rotation,
            size: ship.size
        })
    })

    const cellsStore = await CellsStore.create({
        player: player,
        game: game,
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