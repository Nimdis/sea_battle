import "reflect-metadata";
import { createConnection } from "typeorm";
import { Game } from "./entities/Game";
import { Player } from "./entities/Player";
import socket from 'socket.io'

//const io = socket()

//io.on('connection', s => {
//    console.log('user connected')
//})

//io.listen(3000)


const run = async() => {
    await createConnection();

    console.log("Inserting a new user into the database...");
    
    const player = new Player();
    player.token = "hello";
    const game = new Game();
    game.created_at = player;
    await player.save()
    await game.save()
    //await user.save();
    console.log("Saved a new user with id: " + game.id);

    //console.log("Loading users from the database...");
    //const users = await connection.manager.find(User);
    //console.log("Loaded users: ", users);

    
    //console.log("Here you can setup and run express/koa/any other framework.");

}

run().catch(console.log);