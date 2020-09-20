import { RequestHandler } from "express";

import { IReq } from "../types";
import { PlayerTurn } from "../entities/PlayerTurn"
import { CellsStore } from "../entities/CellsStore"
import { ECellType, ECellTurnType } from "../logic/CellsStore";

// req с номером ячейки (i,j) после чего просиходит новый ход + на поле помечается ячейка как та в которую сходили
export const fire: RequestHandler = async (req: IReq, res) => {
    const { game, player } = req
    const i: number = Number(req.body['i'])
    const j: number = Number(req.body['j'])
    const turns = await PlayerTurn.find({
        where: {
            game
        },
        order: {
            createdAt: 'DESC'
        },
        relations: ['player']
    })

    const enemy = game.players.filter(p => p.id !== player.id)[0]
    const enemyCells = await CellsStore.findOne({
        where:{
            player: enemy
        }
    })

    if(!enemyCells){
        return res.status(500).send() 
    }

    if(i > 9 || i < 0 || j > 9 || j < 0){
        return res.status(400).send()
    }

    if(turns.length){       
        if(turns[0].player.id === player.id){
            return res.status(403).send()
        }
    } else {
        if(player.id % 2 !== game.numOfFirstPlayer){
            return res.status(403).send()
        }
    }

    const { cells } = enemyCells

    if(cells[i][j] === ECellType.missed || cells[i][j] === ECellType.hitted){
        return res.status(400).send()
    }

    const turn = new PlayerTurn()
    turn.player = player
    turn.game = game
    turn.position = {i: i, j: j}

    if(cells[i][j] === ECellType.withShip) {
        enemyCells.cells[i][j] = ECellType.hitted
        turn.type = ECellTurnType.hitted
    } else {
        enemyCells.cells[i][j] = ECellType.missed
        turn.type = ECellTurnType.missed
    }

    await turn.save()
    await enemyCells.save()

    res.json({
        type: turn.type
    })
}