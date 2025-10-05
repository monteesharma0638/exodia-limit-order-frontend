import { AppBar, Autocomplete, Avatar, Box, CircularProgress, Grid, IconButton, ListItemButton, ListItemIcon, ListItemText, Paper, TextField, Typography } from "@mui/material";
import { OrderBook } from "../components/OrderBook";
import PlaceOrder from "../components/PlaceOrder";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useToken } from "wagmi";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL, APP_PATH, CHAIN_ID } from "../constants";
import { useQuery } from "@tanstack/react-query";
import type { IDexscreenerData, IERC20 } from "../interface/IERC20";
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import OrderQueue from "../components/OrderQueue";
import OrderHistory from "../components/OrderHistory";
import { zeroAddress } from "viem";
import { getCompletedOrders, getTargetPairBuyOrders, getTargetPairSellOrders } from "../helpers/supabase";
import React, { useMemo } from "react";
import { useRealtimeOrders, useRealtimeTransactions } from "../hooks/useRealtime";
import { formatOrderTypes, formatTransactionData } from "../helpers/formatters";
import NavBar from "../components/navigation/NavBar";

interface IOrderContext {
	makerToken?: IERC20;
	takerToken?: IERC20;
}

export const OrdersContext = React.createContext<IOrderContext>({});

export default function Orders() {
	const { makerAsset, takerAsset } = useParams();

	const navigate = useNavigate();

	const { data: makerToken, isError: isMakerAssetError, isLoading: isMakerLoading } = useToken({
		chainId: CHAIN_ID,
		address: makerAsset as `0x${string}`,
	});

	const { data: takerToken, isError: isTakerAssetError, isLoading: isTakerLoading } = useToken({
		chainId: CHAIN_ID,
		address: takerAsset as `0x${string}`
	});

	const { data: buyOrdersHttp } = useQuery({
		queryKey: ["buyOrders", makerAsset, takerAsset],
		queryFn: () => getTargetPairBuyOrders(makerAsset ?? zeroAddress, takerAsset ?? zeroAddress),
	});

	const { data: sellOrdersHttp } = useQuery({
		queryKey: ["sellOrders", makerAsset, takerAsset],
		queryFn: () => getTargetPairSellOrders(makerAsset ?? zeroAddress, takerAsset ?? zeroAddress),
	});

	const { data: tokenList } = useQuery<any, Error,IDexscreenerData[]>({
		queryKey: ["list-tokens"],
		queryFn:  () => fetch(API_URL.LIST_TOKENS).then(res => res.json())
	});

    const { data: transactionsHttp } = useQuery({
        queryKey: ["recent-transactions", makerToken?.address, takerToken?.address],
        queryFn: async () => makerToken?.address && takerToken?.address ? await getCompletedOrders(makerToken.address, takerToken.address, 10): [],
		refetchOnWindowFocus: false
    });

	const { realtimeTransactions } = useRealtimeTransactions();
	const { realtimeBuyOrders, realtimeSellOrders } = useRealtimeOrders({makerAsset: makerAsset ?? "", takerAsset: takerAsset ?? ""});
	
	const buyOrders = useMemo(() => {
		let totalOrders;
		const formattedRealTimeOrders = formatOrderTypes(realtimeBuyOrders)
		if(buyOrdersHttp && buyOrdersHttp?.length) {
			totalOrders = [...buyOrdersHttp, ...formattedRealTimeOrders];
		}
		else {
			totalOrders = formattedRealTimeOrders;
		}

		return totalOrders.sort((a, b) => b.price - a.price);
	}, [buyOrdersHttp, realtimeBuyOrders]);

	const sellOrders = useMemo(() => {
		let totalOrders;
		const formattedRealTimeOrders = formatOrderTypes(realtimeSellOrders)

		if (sellOrdersHttp && sellOrdersHttp?.length) {
			totalOrders = [...sellOrdersHttp, ...formattedRealTimeOrders];
		}
		else {
			totalOrders = formattedRealTimeOrders;
		}

		return totalOrders.sort((a, b) => a.price - b.price);
	}, [sellOrdersHttp, realtimeSellOrders]);


	const transactions = useMemo(() => {
		let totalTransactions;

		const filteredRealtimeTransactions = realtimeTransactions.map(txn => {
			const order = buyOrders.find(order => order.order_hash === txn.orderHash) || sellOrders.find(order => order.order_hash === txn.orderHash);
			if(order) {
				return formatTransactionData(txn, order.maker_asset, order.taker_asset, order.making_amount, order.taking_amount);
			}
			else {
				return null;
			}
		}).filter(txn => txn !== null);

		if(transactionsHttp && transactionsHttp?.length) {
			totalTransactions = [...filteredRealtimeTransactions, ...transactionsHttp];
		}
		else {
			totalTransactions = filteredRealtimeTransactions;
		}

		return totalTransactions;
	}, [transactionsHttp, realtimeTransactions])
	
	if(isMakerLoading || isTakerLoading) {
		return (
			<Box bgcolor={(theme) => theme.palette.background.paper} display={"flex"} justifyContent={"center"} height={"100vh"} alignItems={"center"}>
				<CircularProgress />
			</Box>
		)
	}

	
	if (isMakerAssetError || isTakerAssetError || !takerToken || !makerToken) {
		return (
			<Box bgcolor={(theme) => theme.palette.background.paper} display={"flex"} justifyContent={"center"} height={"100vh"} alignItems={"center"}>
				<Paper sx={{minWidth: 10, minHeight: 10}}>
					<Typography variant="h3" color="error">
						One of the token in this pair is not valid
					</Typography>
				</Paper>
			</Box>
		)
	}
	

	return (
		<OrdersContext.Provider value={{
			makerToken,
			takerToken
		}}>
			<Box minHeight={"100vh"}>
				<NavBar />
				<AppBar position="static" sx={{display: "flex"}}>
					<Box sx={{display: "flex", justifyContent: "space-between"}}>
						<Box display={"flex"}>
							<Autocomplete
								options={tokenList ?? []}
								getOptionDisabled={(option) =>
									option.token_address == makerAsset || option.token_address == takerAsset
								}
								sx={{ width: 300 }}
								onChange={(_, newValue) => newValue?.token_address && takerAsset && navigate(APP_PATH.getSwapPath(newValue.token_address, takerAsset))}
								renderInput={(params) => <TextField {...params} label={makerToken.name} />}
								getOptionLabel={(option) => option.metadata.name}
								getOptionKey={(option) => option.token_address}
								renderOption={(props, option) => {
									const {key, ...otherProps} = props as any;
									return <ListItemButton key={key} {...otherProps}>
										<ListItemIcon>
											<Avatar src={option.metadata.image} alt={"$"} />
										</ListItemIcon>
										<ListItemText primary={option.metadata.name} />
									</ListItemButton>
								}
								}
							/>
							<IconButton onClick={() => takerAsset && makerAsset && navigate(APP_PATH.getSwapPath(takerAsset, makerAsset))}>
								<Avatar>
									<SwapHorizIcon />
								</Avatar>
							</IconButton>
							<Autocomplete
								options={tokenList ?? []}
								getOptionDisabled={(option) =>
									option.token_address == makerAsset || option.token_address == takerAsset
								}
								sx={{ width: 300 }}
								onChange={(_, newValue) => newValue?.token_address && makerAsset && navigate(APP_PATH.getSwapPath(makerAsset, newValue.token_address))}
								renderInput={(params) => <TextField {...params} label={takerToken.name} />}
								getOptionLabel={(option) => option.metadata.name}
								getOptionKey={(option) => option.token_address}
								renderOption={(props, option) => {
									const {key, ...otherProps} = props as any;
									return <ListItemButton key={key} {...otherProps}>
										<ListItemIcon>
											<Avatar src={option.metadata.image} alt={"$"} />
										</ListItemIcon>
										<ListItemText primary={option.metadata.name} />
									</ListItemButton>
								}}
							/>
						</Box>
						<ConnectButton />
					</Box>
				</AppBar>
				<Grid container>
					<Grid size={{xs: 12, md: 8}}>
						<OrderBook buyOrders={buyOrders} sellOrders={sellOrders} />
					</Grid>
					<Grid size={{xs: 12, md: 4}}>
						<PlaceOrder makerToken={makerToken} takerToken={takerToken} />
					</Grid>
				</Grid>
				<Grid container>
					<Grid size={{xs:12, md: 6}}>
						<OrderQueue />
					</Grid>
					<Grid size={{xs:12, md: 6}}>
						<OrderHistory transactions={transactions} />
					</Grid>
				</Grid>
			</Box>
		</OrdersContext.Provider>
	)
}