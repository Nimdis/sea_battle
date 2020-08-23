import "reflect-metadata"
import { createConnection } from "typeorm"
import { createServer } from 'http'
import server from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import { routes } from './routes'


const app = server()
const http = createServer(app)

app.use(bodyParser.json())
app.use(cors())

routes(app)

const run = async () => {
    await createConnection()
    http.listen(4000)
    console.log('started..')
}

run()