export const SWAP_ADDRESS = "0x39E4014F502Fd8465f2A747D430B657Fe08bf418";
export const CHAIN_ID = 1337;

export const API_URL = {
    LIST_TOKENS: "/data/tokens.json"
}

export const APP_PATH = {
    getSwapPath: (makerAsset: string, takerAsset: string) => `/limit/${makerAsset}/${takerAsset}`
}