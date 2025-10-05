import type { IGetOrdersForAssetsFuncResponse, IOrderBookSupabaseResponse, IOrderTransactionsFunctionResponse, IOrderTransactionsTableData } from "../interface/ISupabase";

export function formatErrorMessage(err: Error) {
    console.log("🚀 ~ formatErrorMessage ~ err:", err)
    if(err?.message) {
        let message: string = err.message;
        if(message.search("Error:") && message.search("Contract Call:")) {
            message = message.split("Error:")[1].split("Contract Call:")[0];
        }
        return message;
    }
    else {
        return "Unknown Error";
    }
}

export function formatOrderTypes(orders: IOrderBookSupabaseResponse[]): IGetOrdersForAssetsFuncResponse[] {
    return orders.map(order => ({
        maker_asset: order.makerAsset,
        taker_asset: order.takerAsset,
        id: order.orderId,
        chain_id: order.chainId,
        order_hash: order.orderHash,
        making_amount: order.makingAmount,
        taking_amount: order.takingAmount,
        remaining_amount: order.makingAmount,
        salt: order.salt,
        r: order.r,
        sv: order.sv,
        receiver: order.receiver,
        price: order.price,
        target_swap: order.targetSwap,
        maker: order.maker,
        legs: order.legs,
        maker_traits: order.makerTraits
    }))
}

export function formatTransactionData(txn: IOrderTransactionsTableData, makerasset: string, takerasset: string, makingamount: string, takingamount: string): IOrderTransactionsFunctionResponse {
    return {
        ...txn,
        orderamount: txn.orderAmount,
        orderhash: txn.orderHash,
        remainingamount: txn.remainingAmount,
        makerasset,
        takerasset,
        makingamount,
        takingamount,
        transactionhash: txn.transactionHash
    }
}