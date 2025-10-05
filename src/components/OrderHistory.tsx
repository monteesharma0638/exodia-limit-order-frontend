import { Box, colors, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import React from "react";
import { OrdersContext } from "../pages/Orders";
import { useQuery } from "@tanstack/react-query";
import { getCompletedOrders } from "../helpers/supabase";
import { formatUnits } from "viem";

export default function OrderHistory({transactions}: {transactions: any[]}) {
    const {makerToken, takerToken} = React.useContext(OrdersContext);
    
    return (
        <Box height={400} bgcolor={colors.cyan[100]}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ color: colors.deepPurple[600], fontWeight: "bolder" }}>
                            Amount ({makerToken?.symbol})
                        </TableCell>
                        <TableCell sx={{ textAlign: "end", color: colors.deepPurple[600], fontWeight: "bolder" }}>
                            Price ({takerToken?.symbol} / {makerToken?.symbol})
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        transactions?.map(txn => {
                            let type, makingAmount, takingAmount, orderAmount;
                            // const percentageSold = 100 - (parseFloat(txn.remainingamount)*100) / parseFloat(txn.makingamount);
                            if (txn.makerasset == makerToken?.address && txn.takerasset == takerToken?.address) {
                                makingAmount = formatUnits(BigInt(txn.makingamount), Number(makerToken.decimals));
                                takingAmount = formatUnits(BigInt(txn.takingamount), Number(takerToken.decimals));
                                orderAmount = formatUnits(BigInt(txn.orderamount), Number(makerToken?.decimals));
                                type = "sell";
                            }
                            else if (txn.makerasset == takerToken?.address && txn.takerasset == makerToken?.address) {
                                makingAmount = formatUnits(BigInt(txn.takingamount), Number(makerToken.decimals));
                                takingAmount = formatUnits(BigInt(txn.makingamount), Number(takerToken.decimals));
                                orderAmount = formatUnits(BigInt(txn.orderamount), Number(takerToken?.decimals));
                                const price = Number(makingAmount) / Number(takingAmount);
                                console.log("🚀 ~ price:", price);
                                orderAmount = (Number(orderAmount) * price).toString();
                                type = "buy";
                            }
                            else {
                                return null;
                            }

                            const price = Number(takingAmount) / Number(makingAmount);

                            return (
                                <TableRow sx={{backgroundColor: type === "sell" ? colors.red[900]: colors.green[900]}}>
                                    <TableCell>{orderAmount}</TableCell>
                                    <TableCell sx={{textAlign: "end"}}>{price.toFixed(2)}</TableCell>
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>
        </Box>
    )
}