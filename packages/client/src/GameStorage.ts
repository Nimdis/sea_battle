export class GameStorage {
    setPlayerToken(token: string) {
        localStorage.setItem('playerToken', token)
    }

    getPlayerToken() {
        return localStorage.getItem('playerToken') ?? undefined
    }

    setGameToken(token: string) {
        localStorage.setItem('gameToken', token)
    }

    getGameToken() {
        return localStorage.getItem('gameToken') ?? undefined
    }

    clear() {
        localStorage.removeItem('playerToken')
        localStorage.removeItem('gameToken')
    }
}

export const gameStorage = new GameStorage()
