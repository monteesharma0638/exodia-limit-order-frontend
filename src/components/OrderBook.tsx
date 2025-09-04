import {  Box, colors, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import styled from "styled-components";
import type { IOrderBookArgs } from "../interface/ILimitOrder";
import type { IGetOrdersForAssetsFuncResponse, IOrderBookSupabaseResponse } from "../interface/ISupabase";
import Loading from "./Loading";
import React from "react";
import { OrdersContext } from "../pages/Orders";
import { formatUnits } from "viem";

const StyledTypo = styled(Typography)({
	textAlign: "center"
})

interface IOrdersTable {
	type: "buy" | "sell",
	fields: IGetOrdersForAssetsFuncResponse[]
}

const OrdersTable = ({ type, fields }: IOrdersTable) => {
	const {makerToken: maker, takerToken: taker} = React.useContext(OrdersContext);
	// let maker, taker;
	// if(type === "sell") {
	// 	maker = makerToken;
	// 	taker = takerToken;
	// }
	// else {
	// 	maker = takerToken;
	// 	taker = makerToken;
	// }
	return (
		<>
			<StyledTypo color={type === "buy" ? "green" : colors.red[900]}>
				{type === "buy" ? "Buy Orders" : "Sell Orders"}
			</StyledTypo>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Volume ({maker?.symbol})</TableCell>
						<TableCell sx={{ textAlign: "end" }}>Price ({maker?.symbol}/{taker?.symbol})</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{
						fields.map((field, i) => {
							let makingAmount, price;
							if (type === "sell") {
								makingAmount = maker?.decimals ? formatUnits(BigInt(field.making_amount), Number(maker?.decimals)): "0";
								price = field.price;
							}
							else {
								makingAmount = maker?.decimals ? formatUnits(BigInt(field.taking_amount), Number(maker?.decimals)): "0";
								const takingAmount = taker?.decimals ? formatUnits(BigInt(field.making_amount), Number(taker.decimals)): "0";
								price = Number(makingAmount) / Number(takingAmount);
							}
							const filledPercentage = 100 - ((parseFloat(field.remaining_amount ?? field.making_amount) * 100) / parseFloat(field.making_amount));
							
							return (
								<TableRow key={field.order_hash + i} sx={{backgroundImage: `linear-gradient(90deg, ${type === "sell"? colors.red[900]: colors.green[900]} ${Math.floor(filledPercentage)}%, black ${Math.floor(filledPercentage) + 2}%)`}}>
									<TableCell>{makingAmount}</TableCell>
									<TableCell sx={{ textAlign: "end" }}>{price}</TableCell>
								</TableRow>
							)})
					}
				</TableBody>
			</Table>
		</>
	)
}


export function OrderBook({ buyOrders, sellOrders }: IOrderBookArgs) {

	return (
		<Box bgcolor={"darkgray"} sx={{ minHeight: 600 }}>
			<StyledTypo>
				Order Book
			</StyledTypo>
			{
				buyOrders && sellOrders ?
				<Grid container spacing={3}>
					<Grid size={6}>
						<OrdersTable type={"buy"} fields={buyOrders} />
					</Grid>
					<Grid size={6}>
						<OrdersTable type="sell" fields={sellOrders} />
					</Grid>
				</Grid>:
				<Loading />
			}
		</Box>
	)
}