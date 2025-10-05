import { Box, colors, LinearProgress, Typography, useMediaQuery } from "@mui/material";
import theme, { customColors } from "../../theme";

export default function TokenProgress() {
    const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

    return (
        isDesktop?
        <Box width="20%">
            <Typography color="textPrimary">Progress</Typography>
            <Box display={"flex"} justifyContent={"space-between"}>
                <Typography color="textPrimary">86%</Typography>
                <Typography color="textPrimary">54.23 BNB / 60 BNB</Typography>
            </Box>
            <LinearProgress variant="determinate" color="success" sx={{height: 8, borderRadius: 1, "& .MuiLinearProgress-bar": {
                borderRadius: 1
            }}} value={86} />
        </Box>:
        <Box sx={{backgroundImage: `linear-gradient(90deg, ${customColors.green} 86%, black 87%)`, height: "20px", pl: 4, display: "flex", alignItems: "center"}}>
            <Typography fontSize={12} color={colors.common.black}>Progress: 86% 54.23 / 60 BNB</Typography>
        </Box>
    )
}