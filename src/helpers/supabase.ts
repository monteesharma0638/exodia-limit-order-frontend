import {createClient, type PostgrestSingleResponse} from "@supabase/supabase-js";
import type { IOrder } from "../interface/ILimitOrder";
import type { IOrderBookSupabaseArgs, IOrderBookSupabaseResponse } from "../interface/ISupabase";
import type { AddressLike } from "ethers";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_API_URL,
  import.meta.env.VITE_SUPABASE_API_KEY
)

export async function createOrder(order: IOrder, chainId: number, target: string, r: string, sv: string, orderHash: string, legs: number) {
    const result = await supabase.from("order-book").insert<IOrderBookSupabaseArgs>([{
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
        legs
    }])
    
    if([200, 201].includes(result.status)) {
        return true;
    }
    else {
        throw new Error(result?.error?.message ?? "Unknown Error");
    }
}

export async function getSupabaseOrdersByAddress(address: string): Promise<IOrderBookSupabaseResponse[]> {
    const {data, error} = await supabase.from("order-book").select("*").eq("maker", address);
    if(error) {
        // console.log("🚀 ~ getSupabaseOrdersByAddress ~ error:", error)
        throw new Error("Unable to fetch orderbook");
    }
    return data || [];
}

export async function getTargetPairBuyOrders(makerAsset: AddressLike, takerAsset: AddressLike) :Promise<IOrderBookSupabaseResponse[]> {
    const {data, error} = await supabase.from("order-book").select("*").eq("makerAsset", makerAsset).eq("takerAsset", takerAsset).eq("status", "PLACED").order("takingAmount", {
        ascending: true
    });
    if(error) {
        throw new Error("unable to fetch orderbook");
    }
    return data || []
}

export async function getTargetPairSellOrders(makerAsset: AddressLike, takerAsset: AddressLike) :Promise<IOrderBookSupabaseResponse[]> {
    const {data, error} = await supabase.from("order-book").select("*").eq("makerAsset", takerAsset).eq("takerAsset", makerAsset).eq("status", "PLACED").order("takingAmount", {
        ascending: false
    });
    if(error) {
        throw new Error("unable to fetch orderbook");
    }
    return data || []
}


