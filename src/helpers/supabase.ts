import { createClient } from "@supabase/supabase-js";
import type { IOrder } from "../interface/ILimitOrder";
import type { IGetOrdersForAssetsFuncResponse, IOrderBookSupabaseArgs, IOrderBookSupabaseResponse, IOrderTransactionsFunctionResponse } from "../interface/ISupabase";
import type { AddressLike } from "ethers";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_API_URL,
  import.meta.env.VITE_SUPABASE_API_KEY
)

export async function createOrder(order: IOrder, chainId: number, target: string, r: string, sv: string, orderHash: string, legs: number, price: number) {
    const result = await supabase.from("order_book").insert<IOrderBookSupabaseArgs>([{
        ...order,
        makerTraits: order.makerTraits.toString(),
        makingAmount: order.makingAmount.toString(),
        takingAmount: order.takingAmount.toString(),
        salt: order.salt.toString(),
        chainId,
        targetSwap: target,
        r,
        sv,
        orderHash,
        legs,
        price
    }] as any)
    
    if([200, 201].includes(result.status)) {
        return true;
    }
    else {
        throw new Error(result?.error?.message ?? "Unknown Error");
    }
}

export async function getSupabaseOrdersByAddress(address: string): Promise<IOrderBookSupabaseResponse[]> {
    const {data, error} = await supabase.from("order_book").select("*").eq("maker", address);
    if(error) {
        // console.log("🚀 ~ getSupabaseOrdersByAddress ~ error:", error)
        throw new Error("Unable to fetch orderbook");
    }
    return data || [];
}

export async function getTargetPairBuyOrders(makerAsset: AddressLike, takerAsset: AddressLike, limit?: number) :Promise<IGetOrdersForAssetsFuncResponse[]> {
    const {data, error} = await supabase.rpc("get_orders_for_assets", {
        maker: takerAsset,
        taker: makerAsset,
        _limit: limit || 20,
        sort: 'asc'
    });
    console.log("🚀 ~ getTargetPairBuyOrders ~ data:", data)
    if(error) {
        throw new Error("unable to fetch orderbook");
    }
    return data || []
}

export async function getTargetPairSellOrders(makerAsset: AddressLike, takerAsset: AddressLike, limit?: number) :Promise<IGetOrdersForAssetsFuncResponse[]> {
    const { data, error } = await supabase.rpc("get_orders_for_assets", {
        maker: makerAsset,
        taker: takerAsset,
        _limit: limit || 20,
        sort: 'desc'
    });
    if(error) {
        throw new Error("unable to fetch orderbook");
    }
    return data || []
}


export async function getProfitableBuyOrders(makerAsset: AddressLike, takerAsset: AddressLike, price: number, limit?: number) :Promise<IOrderBookSupabaseResponse[]> {
    let query = supabase.from("order_book").select("*").eq("makerAsset", takerAsset).eq("takerAsset", makerAsset).lte("price", price).eq("status", "PLACED").order("price", {
        ascending: false
    });

    if(limit) {
        // add limit if available.
        query = query.limit(limit);
    }
    const { data, error } = await query;
    if(error) {
        throw new Error("unable to fetch orderbook");
    }
    return data || []
}

export async function getCompletedOrders(makerAsset: `0x${string}`, takerAsset: `0x${string}`, limit?: number): Promise<IOrderTransactionsFunctionResponse[]> {
    const { data, error } = await supabase.rpc("get_transactions_for_assets",{ maker: makerAsset, taker: takerAsset });
    console.log("🚀 ~ getCompletedOrders ~ data:", data)
    
    if (error) {
        throw new Error("unable to fetch orderbook");
    }
    return data || []
}