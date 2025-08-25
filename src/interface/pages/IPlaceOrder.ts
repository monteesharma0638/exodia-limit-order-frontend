interface ITokenDetails {
    name?: string,
    symbol?: string,
    decimals?: number,
    address?: string,
    totalSupply?: { formatted: string; value: bigint; }
}

export interface IPlaceOrderArgs {
    makerToken: ITokenDetails,
    takerToken: ITokenDetails
}