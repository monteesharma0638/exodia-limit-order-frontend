import { Box, Paper, Typography } from "@mui/material";

export default function MarketBox({label, value, color}: {label: string, value: string, color?: string}) {
    return (
        <Paper>
            <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} textAlign={"center"}>
                <Typography color="textSecondary" variant="caption">{label}</Typography>
                <Typography fontWeight={"bold"} color={color}>{value}</Typography>
            </Box>
        </Paper>
    )
}