import { Box, Typography, useMediaQuery } from "@mui/material";
import theme from "../../theme";

export default function PriceTag() {
    const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

    return (
        <Box display={"flex"} flexDirection={isDesktop? "column": "row-reverse"} alignItems={"end"}>
            <Typography color="error" sx={{ml: 4}}>$0.0(5)506</Typography>
            <Typography color="error" variant="body2">↓ -0.21%</Typography>
        </Box>
    )
}