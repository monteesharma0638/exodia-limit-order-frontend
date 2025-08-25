import type { AddressLike } from "ethers";

export interface IOrderBookSupabaseArgs {
    chainId: number;
    extension?: string;
    legs?: number;
    maker: AddressLike;
    makerAsset: AddressLike;
    makingAmount: string;
    r: string;
    receiver?: AddressLike;
    salt: string; 
    sv: string;
    takerAsset: AddressLike;
    takingAmount: string;
    targetSwap: string;
    makerTraits: string;
    orderHash: string;
}

export interface IOrderBookSupabaseResponse extends IOrderBookSupabaseArgs {
    status: string;
    legs: number;
    receiver: AddressLike;
    orderId: number;
    extension: string;
    created_at: string;
}