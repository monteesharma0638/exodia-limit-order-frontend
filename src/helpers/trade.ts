import { multicall, readContract } from "viem/actions";
import { getProfitableBuyOrders } from "./supabase";
import { erc20Abi, type Chain, type Client, type Transport } from "viem";
import { LimitOrderProtocol__factory } from "../typechain";
import { SWAP_ADDRESS } from "../constants";
import { MaxUint256 } from "ethers";

export async function getProfitableTrade(client: Client<Transport, Chain | undefined>, makerAsset: string, takerAsset: string, takingAmount: bigint, price: number) {
    console.log("🚀 ~ getProfitableTrade ~ price:", price)
    const buyOrders = await getProfitableBuyOrders(makerAsset, takerAsset, price, 10);
    console.log("🚀 ~ getProfitableTrade ~ buyOrders:", buyOrders)
    for(const order of buyOrders) {
        const contracts: readonly any[] = [{
                abi: LimitOrderProtocol__factory.abi,
                address: SWAP_ADDRESS,
                functionName: "remainingInvalidatorForOrder",
                args: [order.maker, order.orderHash],
            }, {
                abi: erc20Abi,
                address: order.makerAsset as `0x${string}`,
                functionName: "allowance",
                args: [order.maker, SWAP_ADDRESS]
            }, {
                abi: erc20Abi,
                address: order.makerAsset as `0x${string}`,
                functionName: "balanceOf",
                args: [order.maker]
            }];
        let remainingAmount = 0n, allowance = 0n, makerBalance = 0n;
        if(client.chain?.contracts?.multicall3) {
            const results = await multicall(client, {
                contracts,
                allowFailure: true
            });
            remainingAmount = results?.[0]?.result ?? 0n as any;
            allowance = results?.[1]?.result ?? 0n as any;
            makerBalance = results?.[2]?.result ?? 0n as any;
        }
        else {
            [remainingAmount, allowance, makerBalance] = await Promise.all(contracts.map(contract => readContract(client, contract).catch(_=> MaxUint256))) as bigint[];
        }
        console.log("🚀 ~ getProfitableTrade ~ makerBalance:", makerBalance)
        console.log("🚀 ~ getProfitableTrade ~ allowance:", allowance)
        console.log("🚀 ~ getProfitableTrade ~ remainingAmount:", remainingAmount)
        if(makerBalance < BigInt(order.makingAmount)) {
            continue;
        }

        console.log("🚀 ~ getProfitableTrade ~ takingAmount:", takingAmount);
        console.log("🚀 ~ getProfitableTrade ~ order.makingAmount:", order.makingAmount);
        if(remainingAmount >= takingAmount && allowance >= BigInt(order.makingAmount)) {
            return order;
        }
    }
    return null;
}