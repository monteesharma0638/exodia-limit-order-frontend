import {  Box, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import styled from "styled-components";
import type { IOrderBookArgs } from "../interface/ILimitOrder";
import type { IOrderBookSupabaseResponse } from "../interface/ISupabase";
import Loading from "./Loading";

const StyledTypo = styled(Typography)({
	textAlign: "center"
})

interface IOrdersTable {
	type: "buy" | "sell",
	fields: IOrderBookSupabaseResponse[]
}

const OrdersTable = ({ type, fields }: IOrdersTable) => {
	return (
		<>
			<StyledTypo color={type === "buy" ? "green" : "red"}>
				{type === "buy" ? "Buy Orders" : "Sell Orders"}
			</StyledTypo>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Volume</TableCell>
						<TableCell sx={{ textAlign: "end" }}>Price</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{
						fields.map((field, i) => (
							<TableRow key={field.orderHash + i}>
								<TableCell>{field.makingAmount}</TableCell>
								<TableCell sx={{ textAlign: "end" }}>{field.takingAmount}</TableCell>
							</TableRow>
						))
					}
				</TableBody>
			</Table>
		</>
	)
}


const buyDemoFields = [["1.23", "2.12"], ["5.23", "4.12"], ["6.12", "6.75"], ["88.3", "112.2"]].map(v => ({ volume: v[0], price: v[1] }));
const sellDemoFields = [["1.23", "2.12"], ["5.23", "4.12"], ["6.12", "6.75"], ["88.3", "112.2"]].map(v => ({ volume: v[0], price: v[1] }));

export function OrderBook({buyOrders, sellOrders}: IOrderBookArgs) {

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