import { Avatar, Box, Icon, Typography, useMediaQuery } from "@mui/material";
import LanguageIcon from '@mui/icons-material/Language';
import TelegramIcon from '@mui/icons-material/Telegram';
import XIcon from '@mui/icons-material/X';
import theme from "../../theme";

export default function SocialsTag() {

    return (
        <Box display={"flex"} justifyContent={"end"}>
            {[LanguageIcon, XIcon, TelegramIcon, XIcon].map((Icon, i) => (
                <Avatar variant="rounded" key={i} sx={{width: 10, height: 10, margin: 1, padding: 4,  backgroundColor: "transparent", color: (theme) => theme.palette.primary.contrastText, border: (theme) => `1px solid ${theme.palette.primary.light}`}} ><Icon sx={{fontSize: 12}} /></Avatar>
            ))}
        </Box>
    )
}