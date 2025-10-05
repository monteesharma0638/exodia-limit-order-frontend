import { Box, Button, Card, Grid, Link, Table, TableBody, TableCell, TableHead, TableRow, Typography, useMediaQuery } from "@mui/material";
import theme from "../../theme";
import styled from "styled-components";

const StyledTypo = styled(Typography)({
    color: theme.palette.primary.light,
    fontSize: 12
})

const StyledCancelAllButton = styled(Button)({
    backgroundColor: `${theme.palette.error.dark}40`, 
    textTransform: "capitalize", 
    textDecoration: "underline",
    color: theme.palette.error.main
})

const SmallTableCell = styled(TableCell)({
    fontSize: 12
})

const OrderCard = () => (
     <Card sx={{width: "100%", p: 4, mt: 2}}>
                <Grid container>
                    <Grid size={{xs: 6}}>
                        <StyledTypo sx={{fontSize: "1em !important"}}>BERT/BNB</StyledTypo>
                        <StyledTypo><span style={{color: theme.palette.success.main, fontSize: 16}}>Buy</span> 24.09.2025 16:58:33</StyledTypo>
                    </Grid>
                    <Grid size={{xs: 6}} sx={{display: "flex", justifyContent: "flex-end"}}>
                        <a style={{color: theme.palette.error.main, textDecoration: "underline"}}>Cancel</a>
                    </Grid>
                    <Grid size={{xs: 6}}>
                        <StyledTypo>Price (USD)</StyledTypo>
                    </Grid>
                    <Grid size={{xs: 6}} sx={{display: "flex", justifyContent: "flex-end"}}>
                        <StyledTypo>$0.0(5)480</StyledTypo>
                    </Grid>
                    <Grid size={{xs: 6}}>
                        <StyledTypo>Amount</StyledTypo>
                    </Grid>
                    <Grid size={{xs: 6}} sx={{display: "flex", justifyContent: "flex-end"}}>
                        <StyledTypo>100.000.000</StyledTypo>
                    </Grid>
                    <Grid size={{xs: 6}}>
                        <StyledTypo>Filled</StyledTypo>
                    </Grid>
                    <Grid size={{xs: 6}} sx={{display: "flex", justifyContent: "flex-end"}}>
                        <StyledTypo>0.00%</StyledTypo>
                    </Grid>
                    <Grid size={{xs: 6}}>
                        <StyledTypo>Total</StyledTypo>
                    </Grid>
                    <Grid size={{xs: 6}} sx={{display: "flex", justifyContent: "flex-end"}}>
                        <StyledTypo>$480.00 | 0.48 BNB</StyledTypo>
                    </Grid>
                </Grid>
            </Card>
)


const OrdersTableRow = () => {
    return (
        <TableRow>
            <SmallTableCell>24.09.2025 16:58:33</SmallTableCell>
            <SmallTableCell>BERT/BNB</SmallTableCell>
            <SmallTableCell>
                <Typography color="success">
                    BUY
                </Typography>
            </SmallTableCell>
            <SmallTableCell>$0.0(5)480</SmallTableCell>
            <SmallTableCell>100.000.000</SmallTableCell>
            <SmallTableCell>0.00%</SmallTableCell>
            <SmallTableCell>$480.00 | 0.48 BNB</SmallTableCell>
            <SmallTableCell sx={{textAlign: "end"}}><Link sx={{textDecoration: "underline", cursor: "pointer", color: theme.palette.error.main}}>Cancel</Link></SmallTableCell>
        </TableRow>
    )
}

export default function OpenOrders() {
    const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
    const CancelAllButton = <StyledCancelAllButton sx={{px: 3, py: 1}}>Cancel All</StyledCancelAllButton>

    return (
            isDesktop?
                    <Table>
                        <TableHead>
                            <TableCell>Date</TableCell>
                            <TableCell>Pair</TableCell>
                            <TableCell>Side</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Filled</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell sx={{textAlign: "end"}}>{CancelAllButton}</TableCell>
                        </TableHead>
                        <TableBody>
                            <OrdersTableRow />
                            <OrdersTableRow />
                        </TableBody>
                    </Table>:
            <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"end"}>
                {CancelAllButton}
                <Box sx={{maxHeight: 200, overflowY: "scroll"}}>
                    <OrderCard />
                    <OrderCard />
                </Box>
            </Box>
    )
}