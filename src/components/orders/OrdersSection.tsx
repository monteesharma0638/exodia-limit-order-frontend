import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab, Tabs } from "@mui/material";
import { useState, type SetStateAction } from "react";
import theme from "../../theme";
import OpenOrders from "./OpenOrders";

const TabPositions =  {
    HISTORY: "history",
    HOLDER: "holder",
    TOP_10: "top_10",
    MY_POSITIONS: "my_position",
    OPEN_ORDERS: "open_orders"
} as const;

export default function OrdersSection() {
    const [tabValue, setTabValue] = useState(TabPositions.HISTORY);

    const handleTabValueChange = (_: any, value: SetStateAction<"history">) => {
        setTabValue(value);
    }

    return (
        <Box sx={{backgroundColor: theme.palette.background.paper, mx: 2}}>
        <TabContext value={tabValue}>
                <TabList variant="fullWidth" textColor="secondary"  onChange={handleTabValueChange} sx={{
                        "& .MuiTabs-indicator": {
                            display: "none", // remove underline
                        },
                        "& .MuiTab-root": {
                            minHeight: 20,
                            minWidth: "fit-content",
                            paddingX: 0.5, // reduce spacing
                            fontSize: {
                                xs: "0.7rem", // small screen
                                sm: "0.8rem",
                                md: "0.9rem",
                            },
                            textTransform: "none", // prevent ALL CAPS
                        },
                        '& .MuiTabs-list': {
                            justifyContent: "center"
                        },
                        minHeight: 20
                    }}>
                    <Tab sx={{textTransform: "capitalize", maxWidth: "15%"}}  label="History" value={TabPositions.HISTORY} />
                    <Tab sx={{textTransform: "capitalize", maxWidth: "15%"}} label="Holders" value={TabPositions.HOLDER} />
                    <Tab sx={{textTransform: "capitalize", maxWidth: "15%"}} label="Top 10" value={TabPositions.TOP_10} />
                    <Tab sx={{textTransform: "capitalize", maxWidth: "20%"}} label="My positions" value={TabPositions.MY_POSITIONS} />
                    <Tab sx={{textTransform: "capitalize", maxWidth: "25%"}} label="Open Orders (2)" value={TabPositions.OPEN_ORDERS} />
                </TabList>
            <TabPanel value={TabPositions.HISTORY}>Item One</TabPanel>
            <TabPanel value={TabPositions.HOLDER}>Item Two</TabPanel>
            <TabPanel value={TabPositions.TOP_10}>Item Three</TabPanel>
            <TabPanel value={TabPositions.MY_POSITIONS}>Item Three</TabPanel>
            <TabPanel value={TabPositions.OPEN_ORDERS}>
                <OpenOrders />
            </TabPanel>
        </TabContext>
        </Box>
    )
}