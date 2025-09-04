import React, { useMemo, useState, type ChangeEvent } from "react";
import { Avatar, Box, Button, Chip, Paper, Stack, Tab, TextField, Typography } from "@mui/material";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownwardOutlined';
import { useAccount, useClient, usePublicClient, useReadContract, useSignTypedData, useToken, useWalletClient } from "wagmi";
import { buildOrder, buildTakerTraits, fillWithMakingAmount, signOrder } from "../helpers/limit_order";
import { CHAIN_ID, SWAP_ADDRESS } from "../constants";
import { ethers, parseUnits } from "ethers";
import { createOrder, getTargetPairBuyOrders } from "../helpers/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import type { IPlaceOrderArgs } from "../interface/pages/IPlaceOrder";
import { LimitOrderProtocol__factory } from "../typechain";
import { useParams } from "react-router-dom";
import { getProfitableTrade } from "../helpers/trade";
import { readContract, simulateContract, writeContract } from "viem/actions";
import { erc20Abi, formatUnits, maxUint256, zeroAddress } from "viem";
import type { IOrder } from "../interface/ILimitOrder";
import { formatErrorMessage } from "../helpers/formatters";
import { useERC20Balances } from "../hooks/useERC20";

type EnumOutputTokenUnit = "PriceBased" | "TokenBased";
type ChangeHandler = React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;

const validateNumber = (value: string) => {
    return Number.isNaN(Number(value)) && value.length > 0;
}

export default function PlaceOrder({makerToken, takerToken}: IPlaceOrderArgs) {
    const {makerAsset, takerAsset} = useParams();
    const { address } = useAccount();
    const client = usePublicClient();
    const { data: walletClient } = useWalletClient();
    const [outputTokenUnit, setOutputTokenUnit] = useState<EnumOutputTokenUnit>("PriceBased");
    const [sellAmount, setSellAmount] = useState<string>("");
    const [takeAmount, setTakeAmount] = useState<string>("");
    const [takePrice, setTakePrice] = useState<string>("");
    const [legs, setLegs] = useState<number>(1);
    const {data} = useERC20Balances([makerAsset, takerAsset], address);
    const balanceMaker = data?.[0].result;
    const balanceTaker = data?.[1].result;
    const queryClient = useQueryClient();

    const buyAmount = useMemo(() => {
        if (outputTokenUnit === "PriceBased") {
            return (Number(sellAmount) / Number(takePrice)).toString();
        }
        else if (outputTokenUnit === "TokenBased") {
            return takeAmount;
        }
        return null;
    }, [sellAmount, takeAmount, takePrice, outputTokenUnit])
    console.log("🚀 ~ PlaceOrder ~ buyAmount:", buyAmount)

    const { signTypedDataAsync} = useSignTypedData({
        mutation: {
            onError(err) {
                console.log("🚀 ~ onError ~ err:", err)
                let message = err.message;
                if(message.includes('Details:')) {
                    message = message.split("Details:")?.[1]?.split("Version:")?.[0] ?? "";
                }

                Swal.fire({
                    title: "Unable to sign order.",
                    text: message,
                    icon: "error",
                    confirmButtonColor: "red"
                })
            }
        }
    });

    const {mutate: handleOrderMutate, isPending: isOrdering} = useMutation({
        mutationFn: async () => {
            if(!address) throw new Error("No connected wallet found");
            if(!buyAmount || Number.isNaN(buyAmount)) throw new Error("Invalid buy amount");
            if(!sellAmount || Number.isNaN(sellAmount)) throw new Error("Invalid sell amount");
            if(!client) throw new Error("Wallet client not found");
            if(!makerToken?.address) throw new Error("Input tokens is invalid");
            const takingAmount = parseUnits(buyAmount, takerToken?.decimals);
            const makingAmount = parseUnits(sellAmount, makerToken?.decimals);
            const balanceOf = await readContract(client, {
                abi: erc20Abi,
                address: makerToken.address as `0x${string}`,
                args: [
                    address
                ],
                functionName: "balanceOf"
            })

            if(balanceOf < makingAmount) throw new Error("Maker: Insufficient Funds"); // throw if insuffint balance

            const allowance = await readContract(client, {
                abi: erc20Abi,
                address: makerToken.address as `0x${string}`,
                args: [
                    address,
                    SWAP_ADDRESS
                ],
                functionName: 'allowance'
            })

            if(allowance < makingAmount) {
                const {request} = await simulateContract(client, {
                    abi: erc20Abi,
                    address: makerToken.address as `0x${string}`,
                    functionName: "approve",
                    args: [
                        SWAP_ADDRESS,
                        makingAmount
                    ],
                    account: address
                });
                const approvalHash = await writeContract(walletClient as any, request);
                await client.waitForTransactionReceipt({ hash: approvalHash });
                
                console.log("🚀 ~ PlaceOrder ~ approvalHash:", approvalHash);
            }

            const quotePrice = Number(buyAmount) / Number(sellAmount);
            const order = makerAsset && takerAsset? await getProfitableTrade(client, makerAsset, takerAsset, takingAmount, quotePrice): null;
            console.log("🚀 ~ PlaceOrder ~ order:", order);

            if(order) {
                const formattedOrder: IOrder = {
                    salt: BigInt(order.salt),
                    maker: order.maker,
                    makingAmount: order.makingAmount,
                    takingAmount: order.takingAmount,
                    receiver: order.receiver || zeroAddress,
                    makerAsset: order.makerAsset,
                    takerAsset: order.takerAsset,
                    makerTraits: order.makerTraits,
                    extension: order.extension
                }

                const takerTraits = buildTakerTraits({
                    // target: address,
                    makingAmount: true
                })
                
                const {request} = await simulateContract(walletClient as any, {
                    abi: LimitOrderProtocol__factory.abi,
                    address: SWAP_ADDRESS,
                    functionName: "fillOrder",
                    args: [
                        formattedOrder as any, 
                        order.r, 
                        order.sv,
                        takingAmount,
                        takerTraits.traits
                    ],
                    account: address
                })

                const hash = await writeContract(walletClient as any, request);
                
                console.log("🚀 ~ PlaceOrder ~ hash:", hash);
            }
            else {
                const price = Number(sellAmount) / Number(buyAmount); 
                const order = buildOrder({
                    makerAsset: makerToken?.address,
                    takerAsset: takerToken?.address,
                    makingAmount,
                    takingAmount,
                    maker: address,
                });

                const { r, yParityAndS: vs } = ethers.Signature.from(await signOrder(order, CHAIN_ID, SWAP_ADDRESS, signTypedDataAsync));
                const orderHash = await client?.readContract({
                    abi: LimitOrderProtocol__factory.abi,
                    address: SWAP_ADDRESS,
                    functionName: "hashOrder",
                    args: [order as any],
                })

                if(!orderHash) throw new Error("Unable to create order hash.");

                return createOrder(order, CHAIN_ID, SWAP_ADDRESS, r, vs, orderHash, legs, price);
            }
        },
        onError(err) {
            let message = formatErrorMessage(err);
            Swal.fire({
                title: "Unable to sign order.",
                text: message,
                icon: "error",
                confirmButtonColor: "red"
            })
        },
        onSuccess() {
            Swal.fire({
                title: "Order Placed Successfully.",
                text: "Please wait you order is in queue.",
                icon: "success",
                confirmButtonColor: "green",
                timer: 3000
            })
            setTimeout(() => {
                queryClient.refetchQueries(["buyOrders", "sellOrders"] as any)
            }, 2000)
        }
    })



    const handleLegsChange: ChangeHandler = (e) => {
        const value = Number(e.target.value);
        if(value < 2 || value > 10) {
            return;
        }
        setLegs(value)
    };

    const handleSellAmountChange: ChangeHandler = (e) => {
        const value = e.target.value;
        if(validateNumber(value)) return;
        setSellAmount(value);
    }

    const handlePriceChange: ChangeHandler = (e) => {
        const value = e.target.value;
        if(validateNumber(value)) return;
        setTakePrice(value);
    }

    const handleTakeAmountChange: ChangeHandler = (e) => {
        const value = e.target.value;
        if(validateNumber(value)) return;
        setTakeAmount(value);
    }

    return (
        <Box display="flex" alignItems={"center"} flexDirection={"column"} bgcolor={"darkblue"} height={"100%"} paddingX={10} paddingY={10}>
            <Typography color="white">Balance {makerToken.name}: {formatUnits(BigInt(balanceMaker || 0n), makerToken?.decimals || 18)}</Typography>
            <Typography color="white">Balance {takerToken.name}: {formatUnits(BigInt(balanceTaker || 0n), takerToken?.decimals || 18)}</Typography>
            <TextField fullWidth label="Sell Amount" value={sellAmount} onChange={handleSellAmountChange} variant="outlined" InputProps={{endAdornment: makerToken?.symbol}} />
            <Avatar sx={{margin: 2}}>
                <ArrowDownwardIcon />
            </Avatar>
            <TabContext value={outputTokenUnit}>
                <Box>
                    <TabList onChange={(_, newValue) => setOutputTokenUnit(newValue)} aria-label="lab API tabs example">
                        <Tab label="By Price" value="PriceBased" />
                        <Tab label="By Amount" value="TokenBased" />
                    </TabList>
                </Box>
                <TabPanel value="PriceBased"><TextField fullWidth value={takePrice} onChange={handlePriceChange} label="Price" variant="outlined" InputProps={{endAdornment: makerToken?.symbol + "/" + takerToken?.symbol}} /></TabPanel>
                <TabPanel value="TokenBased"><TextField fullWidth value={takeAmount} onChange={handleTakeAmountChange} label={`${takerToken?.symbol} Amount`} variant="outlined" InputProps={{endAdornment: takerToken?.symbol}} /></TabPanel>
            </TabContext>
            <Stack direction="row" marginY={2} spacing={1}>
                <Chip
                    label="Full Amount"
                    onClick={() => setLegs(1)}
                    color={legs === 1 ? 'primary' : 'default'}
                    variant={legs === 1 ? 'filled' : 'outlined'}
                    clickable
                />
                <Chip
                    label="Iceberg"
                    onClick={() => setLegs(2)}
                    color={legs > 1 ? 'primary' : 'default'}
                    variant={legs > 1 ? 'filled' : 'outlined'}
                    clickable
                />
            </Stack>
            {legs > 1 && <TextField helperText="Number of fraction need to do of the order. For iceberg 2 is minimum and 10 is maximum value of legs." type="number" label="Legs" value={legs} onChange={handleLegsChange} />}
            <Button variant="contained" onClick={() => handleOrderMutate()}>Place Order</Button>
        </Box>
    )
}