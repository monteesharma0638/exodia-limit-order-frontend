import { Avatar, Badge, Box, Typography, useMediaQuery } from "@mui/material";
import DemoTokenIcon from "./../../assets/icons/demo_token.png";
import BadgeIcon from "../../assets/icons/hand_icon.png";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import styled from "styled-components";
import theme from "../../theme";

const TokenDetailsTypo = styled(Typography)({
    color: theme.palette.primary.contrastText
})

export default function TokenDetails() {
    const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

    return (
        <Box display={"flex"}>
            <Badge 
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}

                overlap="circular"
                badgeContent={
                    <Avatar 
                        alt="Badge"
                        src={BadgeIcon}
                        sx={{ height: 20, width: 20 }}
                    />
                }
            >
                <Avatar 
                    alt="Token"
                    src={DemoTokenIcon}
                    sx={{
                        height: 50,
                        width: 50
                    }}
                />
            </Badge>
            <Box ml={5}>
                <TokenDetailsTypo variant="body1">Bert {isDesktop ? <span style={{fontSize: "0.7em"}}>Bertram</span>: ""} </TokenDetailsTypo>
                <TokenDetailsTypo variant="body2">0xbee…108 <ContentCopyIcon /></TokenDetailsTypo>
            </Box>
        </Box>
    )
}