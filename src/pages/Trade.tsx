import { Box, Button, ButtonGroup, Card, colors, Divider, Grid, TableCell, TableRow, Typography, useMediaQuery } from "@mui/material";
import NavBar from "../components/navigation/NavBar";
import TokenProgress from "../components/token/TokenProgress";
import TokenDetails from "../components/token/TokenDetails";
import PriceTag from "../components/token/PriceTag";
import SocialsTag from "../components/token/SocialsTag";
import theme, { primaryFont } from "../theme";
import MarketBox from "../components/token/MarketBox";
import ChartImage from "../assets/images/Bild/Bild.png"
import OrdersSection from "../components/orders/OrdersSection";
import BullNBearPortion from "../components/market/BullNBearPortion";
import styled from "styled-components";
import BigChartImage from "../assets/images/Bild-big/Bild-2x.png";
import TradeCard from "../components/market/TradeCard";
import AuditCard from "../components/token/AuditCard";
import PoolInfo from "../components/token/PoolInfo";
import Footer from "../components/sections/Footer";

const TradeOptionsTypo = styled(Typography)({
    fontFamily: primaryFont,
    color: theme.palette.common.white,
    textAlign: "center",
    padding: 10,
    border: `0.01px solid ${theme.palette.primary.light}`,
    borderBottom: "none"
})

const StyledEndCell = styled(TableCell)({
    flexGrow: 1
})

const StyledTableRow = styled(TableRow)({
    display: "flex",
    maxHeight: 30
})

const StyledGrid = styled(Grid)({
    padding: 10
})

const marketDetails = [
    {
        label: "Market Cap",
        value: "$50.61K"
    },
    {
        label: "Liquidity",
        value: "$20.13K"
    },
    {
        label: "24H Volume",
        value: "$120K"
    },
    {
        label: "Holders",
        value: "231"
    },
    {
        label: "Top 10",
        value: "67%",
        color: theme.palette.error.main
    },
    {
        label: "Honeypot",
        value: "no",
        color: theme.palette.success.light
    },
    {
        label: "Renounced",
        value: "yes",
        color: theme.palette.success.light
    },
    {
        label: "Tax",
        value: "0% / 0%",
        color: theme.palette.success.light
    },
]

export default function Trade() {
    const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

    return (
        <Box bgcolor={(theme) => theme.palette.common.black} minHeight="100vh" >
            <NavBar />
            {
                isDesktop?
                <DesktopVersion />:
                <MobileVersion />
            }
        </Box>
    )
}


function DesktopVersion() {
    return (
        <Box display={"flex"} flexDirection={"column"}>
            <Grid container sx={{flexGrow: 1}}>
                <Grid size={{md: 9.7}}>
                    <Box display={"flex"} >
                        <TokenDetails />
                        <Box>
                            <Typography color="textPrimary" variant="body2">Socials</Typography>    
                            <SocialsTag />
                        </Box>
                        <TokenProgress />
                        <Box flexGrow={1}></Box>
                        <PriceTag />
                    </Box>
                    <img src={BigChartImage} />
                    <OrdersSection />
                </Grid>
                <Grid size={{md: 2.3}} sx={{maxHeight: "91vh", overflowY: "auto", "::-webkit-scrollbar": {
                    width: 2,
                    color: "white"
                }, "::-webkit-scrollbar-thumb": {
                    backgroundColor: theme.palette.secondary.main,
                }}}>
                    <Card sx={{p: 2, m: 2}}>
                        <Typography sx={{p: 2}}>Bull Vs Bear Index</Typography>
                        <BullNBearPortion />
                        <Divider sx={{my: 3}} />
                        <Box>
                            <Grid container>
                                <Grid size={{md: 3}}>
                                    <MarketBox label="Market Cap" value={"$50.61K"} />
                                </Grid>
                                <Grid size={{md: 3}}>
                                    <MarketBox label="Liquidity" value={"$20.13K"} />
                                </Grid>
                                <Grid size={{md: 3}}>
                                    <MarketBox label="24H Volume" value={"$120K"} />
                                </Grid>
                                <Grid size={{md: 3}}>
                                    <MarketBox label="Holders" value={"231"} />
                                </Grid>
                            </Grid>
                        </Box>
                        <Divider sx={{my: 3}} />
                        <Box sx={{
                            '.MuiTableCell-root': {
                                border: 0
                            },
                            pb: 6
                        }}>
                            <StyledTableRow>
                                <StyledEndCell>Top 10 Holder amount</StyledEndCell>
                                <TableCell>67 %</TableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledEndCell>Honeypot</StyledEndCell>
                                <TableCell>no</TableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledEndCell>Renounced</StyledEndCell>
                                <TableCell>yes</TableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledEndCell>Liquidity locked</StyledEndCell>
                                <TableCell>yes</TableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledEndCell>Buy Tax / Sell Tax</StyledEndCell>
                                <TableCell>0% / 0%</TableCell>
                            </StyledTableRow>
                        </Box>
                    </Card>
                    <TradeCard />
                    <Card sx={{p: 2, m: 2}}>
                        <Grid container>
                            <StyledGrid size={3} sx={{borderRight: `1px solid ${theme.palette.primary.light}`}}>
                                <MarketBox label="5m" value="+3.21%" color={theme.palette.success.main} />
                            </StyledGrid>
                            <StyledGrid size={3}  sx={{borderRight: `1px solid ${theme.palette.primary.light}`}}>
                                <MarketBox label="1h" value="-5.74%" color={theme.palette.error.main} />
                            </StyledGrid>
                            <StyledGrid size={3}  sx={{borderRight: `1px solid ${theme.palette.primary.light}`}}>
                                <MarketBox label="6h" value="+24.76" color={theme.palette.success.main} />
                            </StyledGrid>
                            <StyledGrid size={3}>
                                <MarketBox label="24h" value="+18.98" color={theme.palette.success.main} />
                            </StyledGrid>
                        </Grid>
                        <Divider />
                        <Grid container>
                            <StyledGrid size={2.8}>
                                <MarketBox label="Volume" value="$12K" />
                            </StyledGrid>
                            <StyledGrid size={2.8}>
                                <MarketBox label="Buys" value="$12K" color={theme.palette.success.main} />
                            </StyledGrid>
                            <StyledGrid size={2.8}>
                                <MarketBox label="Sells" value="$12K" color={theme.palette.error.main} />
                            </StyledGrid>
                            <StyledGrid size={3.6}>
                                <MarketBox label="Net inflow" value="+$2K" color={theme.palette.success.main} />
                            </StyledGrid>
                        </Grid>
                    </Card>
                    <AuditCard />
                    <PoolInfo />
                </Grid>
            </Grid>
            <Footer />
        </Box>
    )
}

function MobileVersion() {
    return (
        <>
            <Card sx={{marginTop: 3, marginX: 2, border: theme => `0.1px solid ${theme.palette.primary.light}`}}>
                <TokenProgress />
                <Box padding={5} display={"flex"} flexDirection={"row"} justifyContent={"space-between"}>
                    <TokenDetails />
                    <Box>
                        <PriceTag />
                        <SocialsTag />
                    </Box>
                </Box>
                <Grid container>
                    {
                        marketDetails.map((value, index) => (
                            <Grid key={index} size={{xs: 3}} border={`0.1px solid ${theme.palette.primary.light}`}>
                                <MarketBox label={value.label} value={value.value} color={value?.color} />
                            </Grid>
                        ))
                    }
                </Grid>
                <img src={ChartImage} height={"200px"} />
                <OrdersSection />
            </Card>
            <BullNBearPortion />
            <Box mt={4}>
                <Grid container>
                    <Grid size={{xs: 3}}>
                        <TradeOptionsTypo borderLeft={"none !important"}>INFO</TradeOptionsTypo>
                    </Grid>
                    <Grid size={{xs: 3}}>
                        <TradeOptionsTypo>BUY</TradeOptionsTypo>
                    </Grid>
                    <Grid size={{xs: 3}}>
                        <TradeOptionsTypo>SELL</TradeOptionsTypo>
                    </Grid>
                    <Grid size={{xs: 3}}>
                        <TradeOptionsTypo borderRight={"none !important"}>AUDIT</TradeOptionsTypo>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}