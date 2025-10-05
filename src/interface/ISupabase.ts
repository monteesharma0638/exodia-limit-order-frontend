type AddressLike = `0x${string}`;

export interface IOrderBookSupabaseArgs {
    chainId: number;
    extension?: string;
    legs?: number;
    maker: AddressLike;
    makerAsset: AddressLike;
    makingAmount: string;
    r: `0x${string}`;
    receiver?: AddressLike;
    salt: string; 
    sv: `0x${string}`;
    takerAsset: AddressLike;
    takingAmount: string;
    targetSwap: string;
    makerTraits: string;
    orderHash: `0x${string}`;
    price: number;
}

export interface IOrderBookSupabaseResponse extends IOrderBookSupabaseArgs {
    status: string;
    legs: number;
    receiver: AddressLike;
    orderId: number;
    extension: string;
    created_at: string;
}

export interface IGetOrdersForAssetsFuncResponse {
    id: number;
    order_hash: string;
    maker_asset: string;
    taker_asset: string;
    making_amount: string;
    taking_amount: string;
    remaining_amount: string;
    maker: string;
    receiver: string;
    salt: string;
    r: string;
    sv: string;
    legs: number;
    chain_id: number;
    target_swap: string;
    maker_traits: string;
    price: number;
}

export interface IOrderTransactionsFunctionResponse {
    id: number,
    orderhash: string,
    transactionhash: string,
    makerasset: string,
    takerasset: string,
    makingamount: string,
    takingamount: string,
    remainingamount: string,
    orderamount: string
}

export interface IOrderTransactionsTableData {
    id: number,
    orderHash: string,
    transactionHash: string,
    remainingAmount: string,
    orderAmount: string
}