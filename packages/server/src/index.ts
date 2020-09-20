import "reflect-metadata"
import { createConnection } from "typeorm"
import { createServer } from 'http'
import server from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import socketIO from 'socket.io';

import { routes } from './routes'

const app = server()
const http = createServer(app)
const io = socketIO(http)

app.use(bodyParser.json())
app.use(cors())

// 1. Connect user
// 2. Create room for game
// 3. Connect second user
// 4. Game

routes(app)

io.on('connection', s => {
})

const PORT = 4000;

const run = async () => {
    await createConnection()
    http.listen(PORT)
    console.log(`Listen port ${PORT}`)
}

run()