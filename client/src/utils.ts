import { Socket } from 'socket.io-client'

// TODO should be replaced with real http requests

export const syncRequest = <T>(socket: typeof Socket, emitName: string, onceName: string, timeout: number = 10000) => {
    return new Promise<T>((resolve, reject) => {
        socket.emit(emitName)
        socket.once(onceName, (msg: T) => {
            resolve(msg)
        })
        setTimeout(() => {
            socket.off(onceName)
            reject(new Error('Timout'))
        }, timeout);
    }) 
};