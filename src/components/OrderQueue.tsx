import { Box, colors, Tab, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { getSupabaseOrdersByAddress } from "../helpers/supabase";
import { TabContext, TabList } from "@mui/lab";
import { useState } from "react";
import DisplayOrderRow from "./orderqueue/DisplayOrderRow";


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

const STATUS_TABS = {
    COMPLETED: "COMPLETED",
    PENDING: "PLACED"
} as const;

export default function OrderQueue() {
    const {address} = useAccount();
    const [tab, setTab] = useState(STATUS_TABS.PENDING);
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
    
    const filteredOrders = orders.filter(order => order.status === tab);
    return (
        <Box minHeight={400} bgcolor={(theme) => theme.palette.background.paper}>
            <Typography variant="h5" textAlign={"center"} color={colors.cyan[100]} sx={{textDecoration: "underline"}}>Your Pending Orders</Typography>
            <TabContext value={tab}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={(_, newValue) => setTab(newValue)} aria-label="lab API tabs example">
                        <Tab label="Pending Orders" value={STATUS_TABS.PENDING} />
                        <Tab label="Completed Orders" value={STATUS_TABS.COMPLETED} />
                    </TabList>
                </Box>
                {
                    filteredOrders.length?
                    (
                        <Table sx={{overflowY: "scroll"}}>
                            {CustomTableHead}
                            <TableBody>
                                {
                                    filteredOrders.map((order) => <DisplayOrderRow key={order.orderHash} order={order} />)
                                }
                            </TableBody>
                        </Table>
                    ): (
                    <Box display="flex" justifyContent={"center"} alignItems={"center"} height={"100%"}>
                        <Typography color="primary" textAlign={"center"}>No orders found</Typography>
                    </Box>)
                }
            </TabContext>
        </Box>
    )
}