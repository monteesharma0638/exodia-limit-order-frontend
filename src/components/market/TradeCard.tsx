import { Box, Button, ButtonGroup, Card, TextField, Typography } from "@mui/material";
import styled from "styled-components";
import theme from "../../theme";

const StyledTypo = styled(Typography)({
    margin: 2,
    color: theme.palette.primary.light,
    cursor: "pointer",
    fontSize: 12
})

export default function TradeCard() {
    return (
        <Card sx={{m: 2, px: 2, py: 4}}>
            <Box display={"flex"} gap={5}>
                <Button variant="contained" color="inherit" sx={{width: "50%"}}> Buy </Button>
                <Button variant="outlined" color="inherit" sx={{width: "50%"}}> Sell </Button>
            </Box>
            <Box display={"flex"} >
                <StyledTypo>Market</StyledTypo>
                <StyledTypo>Limit</StyledTypo>
                <StyledTypo sx={{flexGrow: 1, color: "white !important"}}>Iceberg</StyledTypo>
                <Typography fontSize={12} color="textDisabled">Balance: 14.03 BNB</Typography>
            </Box>
            <Box>
                <TextField variant="outlined" placeholder="BNB Amount" size="small" fullWidth slotProps={{
                    input: {
                        endAdornment: <Typography fontSize={12} minWidth={"18%"}>0.00 BNB</Typography>
                    }
                }}  />
                <ButtonGroup variant="outlined" size="small" color="secondary" fullWidth>
                    <Button>0.05</Button>
                    <Button>0.25</Button>
                    <Button>0.5</Button>
                    <Button>1</Button>
                </ButtonGroup>
            </Box>
            <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                <Typography color="secondary">Price</Typography>
                <TextField  placeholder="Amount" size="small" sx={{width: 100}} />
            </Box>
            <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                <Typography color="secondary">Percentage / Size</Typography>
                <TextField  placeholder="Size" size="small" sx={{width: 100}} />
            </Box>
            <Button fullWidth variant="outlined" color="success">
                Buy Bert
            </Button>
        </Card>
    )
}