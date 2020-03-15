
interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: any
}

declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV?: "development" | "production"
    }
}