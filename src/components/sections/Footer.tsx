import { Box, Button, Typography } from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

export default function Footer() {
    return (
        <Box display={"flex"}>
            <Typography color="primary"><StarIcon /> WATCHLIST [3]</Typography>
            <Typography color="primary"> <AccountBalanceWalletIcon /> ACTIVE TRADES [12]</Typography>
            <Box flexGrow={1}></Box>
            <Button color="primary" variant="contained">
                $87.1K
            </Button>
        </Box>
    )
}