import type { AddressLike } from "ethers";
import type { IGetOrdersForAssetsFuncResponse } from "./ISupabase";
import type { IERC20 } from "./IERC20";

export interface IOrder {
    salt: bigint;
    maker: AddressLike;
    receiver: AddressLike;
    makerAsset: AddressLike;
    takerAsset: AddressLike;
    makingAmount: string | bigint;
    takingAmount: string | bigint;
    makerTraits: string | bigint;
    extension: string;
}

export interface IOrderBookArgs {
    buyOrders?: IGetOrdersForAssetsFuncResponse[],
    sellOrders?: IGetOrdersForAssetsFuncResponse[]
}