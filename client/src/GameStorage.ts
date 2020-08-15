export class GameStorage {
    setToken(token: string) {
        localStorage.setItem('token', token)
    }

    setPlayerToken(token: string) {
        localStorage.setItem('playerToken', token)
    }

    getToken() {
        return localStorage.getItem('token')
    }

    getPlayerToken() {
        return localStorage.getItem('playerToken')
    }
}

export const gameStorage = new GameStorage()