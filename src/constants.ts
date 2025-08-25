export const SWAP_ADDRESS = "0x582EEe4908A9D9b331B3fCb8fAEb04Bac79f248D";
export const CHAIN_ID = 1337;

export const API_URL = {
    LIST_TOKENS: "/data/tokens.json"
}

export const APP_PATH = {
    getSwapPath: (makerAsset: string, takerAsset: string) => `/limit/${makerAsset}/${takerAsset}`
}