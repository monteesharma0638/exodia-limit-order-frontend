import { Box, Typography } from "@mui/material";
import theme, { primaryFont } from "../../theme";
import styled from "styled-components";

const StyledTypo = styled(Typography)({
    color: theme.palette.primary.main,
    lineHeight: 1.2
})

export default function BullNBearPortion() {
    return (
        <Box mx={1.5} borderRadius={1} sx={{backgroundImage: "linear-gradient(90deg, #03FFA3 40%, #03FFA3 50%, #FE4B4A 60%, #FE4B4A 70%)", paddingY: 0}} display={"flex"} justifyContent={"space-between"} alignItems={"center"} px={4} py={2}>
            <StyledTypo variant="caption">BULL 60%</StyledTypo>
            <StyledTypo fontWeight={"bolder"} fontFamily={primaryFont}>VS</StyledTypo>
            <StyledTypo variant="caption">40% BEAR</StyledTypo>
        </Box>
    )
}