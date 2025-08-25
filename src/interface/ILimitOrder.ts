import type { AddressLike } from "ethers";
import type { IOrderBookSupabaseResponse } from "./ISupabase";

export interface IOrder {
    salt: bigint;
    maker: AddressLike;
    receiver: AddressLike;
    makerAsset: AddressLike;
    takerAsset: AddressLike;
    makingAmount: number;
    takingAmount: number;
    makerTraits: string | bigint;
    extension: string;
}

export interface IOrderBookArgs {
    buyOrders?: IOrderBookSupabaseResponse[],
    sellOrders?: IOrderBookSupabaseResponse[]
}