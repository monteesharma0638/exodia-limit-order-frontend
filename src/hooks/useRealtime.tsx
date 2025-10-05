import { useEffect, useState } from "react";
import { supabase } from "../helpers/supabase";
import type { IOrderBookSupabaseResponse, IOrderTransactionsTableData } from "../interface/ISupabase";

interface IUseRealtimeOrders {
    makerAsset: string;
    takerAsset: string;
}

export function useRealtimeOrders({makerAsset, takerAsset}: IUseRealtimeOrders) {
    const [ realtimeBuyOrders, setRealtimeBuyOrders ] = useState<IOrderBookSupabaseResponse[]>([]);
	const [ realtimeSellOrders, setRealtimeSellOrders ] = useState<IOrderBookSupabaseResponse[]>([]);

    useEffect(() => {
        const orderBook = supabase.channel('order_updates')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'order_book', filter: `makerAsset=in.(${makerAsset}, ${takerAsset}), takerAsset=in.(${takerAsset}, ${makerAsset})` },
                (payload) => {
                    // console.log('Change received! order updates', payload);
                    const data: IOrderBookSupabaseResponse = payload.new as any;
                    if (makerAsset === data.makerAsset && takerAsset === data.takerAsset) {
                        setRealtimeBuyOrders(prev => ([...prev, data ]));
                    }
                    else if (takerAsset === data.makerAsset && makerAsset === data.takerAsset) {
                        setRealtimeSellOrders(prev => ([...prev, data]));
                    }
                    else {
                        return;
                    }
                }
            )
            .subscribe()
        
        return () => {
            orderBook.unsubscribe();
        }
    }, [makerAsset, takerAsset])

    return {
        realtimeBuyOrders,
        realtimeSellOrders,
    }
}

export function useRealtimeTransactions() {
    const [ newTransactions, setNewTransactions ] = useState<IOrderTransactionsTableData[]>([]);

    useEffect(() => {
        const transactions = supabase.channel('transactions_updates')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'order_transactions' },
                (payload) => {
                    // console.log('Change received! Transaction', payload);
                    const data: IOrderTransactionsTableData = payload.new as any;
                    setNewTransactions(prev => ([...prev, data]));
                }
            ).subscribe()

        return () => {
            transactions.unsubscribe();
        }
    }, [setNewTransactions])

    return {
        realtimeTransactions: newTransactions
    }
}