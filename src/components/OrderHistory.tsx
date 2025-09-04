import { Box, colors, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import React from "react";
import { OrdersContext } from "../pages/Orders";
import { useQuery } from "@tanstack/react-query";
import { getCompletedOrders } from "../helpers/supabase";
import { formatUnits } from "viem";

export default function OrderHistory() {
    const {makerToken, takerToken} = React.useContext(OrdersContext);

    const { data: transactions } = useQuery({
        queryKey: ["recent-transactions", makerToken?.address, takerToken?.address],
        queryFn: async () => makerToken?.address && takerToken?.address ? getCompletedOrders(makerToken.address, takerToken.address, 10): []
    });
    console.log("🚀 ~ OrderHistory ~ transactions:", transactions)
    
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
                            const percentageSold = 100 - (parseFloat(txn.remainingamount)*100) / parseFloat(txn.makingamount);
                            if (txn.makerasset == makerToken?.address && txn.takerasset == takerToken?.address) {
                                makingAmount = formatUnits(BigInt(txn.makingamount), Number(makerToken.decimals));
                                takingAmount = formatUnits(BigInt(txn.takingamount), Number(takerToken.decimals));
                                orderAmount = ((percentageSold/100) * parseFloat(makingAmount)).toString();
                                type = "sell";
                            }
                            else if (txn.makerasset == takerToken?.address && txn.takerasset == makerToken?.address) {
                                makingAmount = formatUnits(BigInt(txn.takingamount), Number(makerToken.decimals));
                                takingAmount = formatUnits(BigInt(txn.makingamount), Number(takerToken.decimals));
                                orderAmount = ((percentageSold * parseFloat(makingAmount)) / 100).toString();
                                type = "buy";
                            }
                            else {
                                return null;
                            }

                            // const orderAmount = 0;
                            const price = Number(takingAmount) / Number(makingAmount);

                            return (
                                <TableRow sx={{backgroundColor: type === "sell" ? colors.red[900]: colors.green[900]}}>
                                    <TableCell>{orderAmount}</TableCell>
                                    <TableCell sx={{textAlign: "end"}}>{price}</TableCell>
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>
        </Box>
    )
}