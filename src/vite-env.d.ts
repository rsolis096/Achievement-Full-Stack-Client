/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_WEB_API_KEY : string
    readonly VITE_ACCESS_TOKEN : string
    readonly VITE_STEAM_ID: string
    readonly VITE_CLIENT_DOMAIN : string
    readonly VITE_SERVER_DOMAIN : string

}

interface ImportMeta {
    readonly env: ImportMetaEnv
}