type Address = `0x${string}`;

export interface IERC20 {
    name?: string,
    symbol?: string,
    decimals?: Number,
    address?: Address,
    totalSupply?: string | { formatted: string; value: bigint; },
    ticker?: string
}

export interface IDexscreenerData {
    token_address: Address,
    creator_address: Address,
    event_name: string,
    block_number: number,
    token_created_at: string,
    price_usd: number | null,
    market_cap_usd: number | null,
    volume_24h: number | null,
    price_change_24h: number | null,
    price_updated_at: string | null,
    pool_type: "new" | "finalizing" | "finalized",
    metadata: {
        name: string,
        image: `https://${string}`,
        symbol: string,
        socials: Array<any>,
        decimals: number,
        websites: Array<any>,
        description: string,
        totalSupply: string
    }
}