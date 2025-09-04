import { erc20Abi } from "viem";
import { useReadContracts } from "wagmi";

export function useERC20Balances(tokens: Array<string | undefined>, address?: string) {
    return useReadContracts({
        contracts: tokens.map(token => ({
            abi: erc20Abi,
            address: token as `0x${string}`,
            functionName: "balanceOf",
            args: [
                address
            ]
        }))
    })
}