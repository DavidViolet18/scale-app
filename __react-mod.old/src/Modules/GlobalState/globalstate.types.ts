export type GlobalStateAction<T> = {
    type: string
    payload: T
}

export type GlobalStateActionCreator<T> = {
    type: string
    (payload: T) : GlobalStateAction<T>
}
