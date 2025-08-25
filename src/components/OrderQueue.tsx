import { Box, colors, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { getSupabaseOrdersByAddress } from "../helpers/supabase";


const CustomTableHead = (
    <TableHead>
        <TableRow>
            <TableCell>
                Amount
            </TableCell>
            <TableCell sx={{flexGrow: 1}}>
                Type
            </TableCell>
            <TableCell>
                Order Date
            </TableCell>
        </TableRow>
    </TableHead>
)

export default function OrderQueue() {
    const {address} = useAccount();
    const {data: orders} = useQuery({
        queryKey: ["orders-by-address", address],
        queryFn: () => address ? getSupabaseOrdersByAddress(address): []
    });
    // console.log("🚀 ~ OrderQueue ~ orders:", orders)

    if(!orders?.length) {
        return (
            <Box minHeight={400} bgcolor={(theme) => theme.palette.background.paper} >
                <Table>
                    {CustomTableHead}
                </Table>
                <Box height={300} display="flex" justifyContent={"center"} alignItems={"center"}>
                    <Typography color="primary">No order found. Create an order to get started.</Typography>
                </Box>
            </Box>
        )
    }

    return (
        <Box minHeight={400} bgcolor={(theme) => theme.palette.background.paper}>
            <Typography variant="h5" textAlign={"center"} color={colors.cyan[100]} sx={{textDecoration: "underline"}}>Your Pending Orders</Typography>
            <Table sx={{overflowY: "scroll"}}>
                {CustomTableHead}
                <TableBody>
                    {
                        orders.map((order) => (
                            <TableRow key={order.salt}>
                                <TableCell>
                                    {order.makingAmount}
                                </TableCell>
                                <TableCell>
                                    {Number(order.makingAmount)/Number(order.takingAmount)}
                                </TableCell>
                                <TableCell>
                                    {order.created_at}
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </Box>
    )
}