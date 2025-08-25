import React, { useMemo, useState, type ChangeEvent } from "react";
import { Avatar, Box, Button, Chip, Paper, Stack, Tab, TextField, Typography } from "@mui/material";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownwardOutlined';
import { useAccount, useClient, usePublicClient, useReadContract, useSignTypedData, useToken } from "wagmi";
import { buildOrder, signOrder } from "../helpers/limit_order";
import { CHAIN_ID, SWAP_ADDRESS } from "../constants";
import { ethers, parseUnits } from "ethers";
import { createOrder } from "../helpers/supabase";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import type { IPlaceOrderArgs } from "../interface/pages/IPlaceOrder";
import { LimitOrderProtocol__factory } from "../typechain";

type EnumOutputTokenUnit = "PriceBased" | "TokenBased" | "AtMarket";
type ChangeHandler = React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;

const validateNumber = (value: string) => {
    return Number.isNaN(Number(value)) && value.length > 0;
}

export default function PlaceOrder({makerToken, takerToken}: IPlaceOrderArgs) {
    const { address } = useAccount();
    const client = usePublicClient();
    const [outputTokenUnit, setOutputTokenUnit] = useState<EnumOutputTokenUnit>("PriceBased");
    const [sellAmount, setSellAmount] = useState<string>("");
    const [takeAmount, setTakeAmount] = useState<string>("");
    const [takePrice, setTakePrice] = useState<string>("");
    const [legs, setLegs] = useState<number>(1);

    const finalTakerAmount = useMemo(() => {
        if(outputTokenUnit === "PriceBased") {
            return (Number(sellAmount) * Number(takePrice)).toString();
        }
        else if(outputTokenUnit === "TokenBased") {
            return takeAmount;
        }
        return null;
    }, [sellAmount, takeAmount, takePrice, outputTokenUnit])

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
            if(!finalTakerAmount) throw new Error("Taker amount is null");
            const order = buildOrder({
                makerAsset: makerToken?.address,
                takerAsset: takerToken?.address,
                makingAmount: parseUnits(sellAmount, makerToken?.decimals),
                takingAmount: parseUnits(finalTakerAmount, takerToken?.decimals),
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

            return createOrder(order, CHAIN_ID, SWAP_ADDRESS, r, vs, orderHash, legs);
        },
        onError(err) {
            console.log('handleOrderMutate~error', err);
            let message = err.message;
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
                <TabPanel value="PriceBased"><TextField fullWidth value={takePrice} onChange={handlePriceChange} label="Price" variant="outlined" InputProps={{endAdornment: takerToken?.symbol + "/" + makerToken?.symbol}} /></TabPanel>
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