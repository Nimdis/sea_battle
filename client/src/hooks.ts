import { useEffect } from 'react'

export interface IScreenStore {
    onMount?: () => void
    onUnmount?: () => void
}

export const useScreenStoreHooks = (store: IScreenStore) => {
    useEffect(() => {
        if (store.onMount) {
            store.onMount()
        }
        return () => {
            if (store.onUnmount) {
                store.onUnmount()
            }
        }
    })
}