import { Alert, AppBar, Autocomplete, Avatar, Box, Button, FormControl, Drawer, IconButton, InputAdornment, InputLabel, MenuItem, Paper, Select, TextField, Typography, useMediaQuery, List, ListItem, ListItemButton } from "@mui/material";
import Calque from "../../assets/Calque/Calque.png";
import styled from "styled-components";
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import BinanceIcon from "../../assets/icons/binance.svg";
import AbstractIcon from "../../assets/icons/abstract.svg";
import theme, { customColors, primaryFont } from "../../theme";
import { useState } from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CustomConnectButton from "../wallet/CustomConnectButton";
import SegmentIcon from '@mui/icons-material/Segment';

const StyledMenuItem = styled(Typography)({
    marginLeft: 10,
    marginRight: 10,
    cursor: "pointer",
    fontFamily: primaryFont,
    fontSize: 12
})

export default function NavBar() {
    const [selectedChain, setSelectedChain] = useState(0);
    const [drawerOpened, toggleDrawer] = useState(false);
    const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
    const isBigScreen = useMediaQuery(theme.breakpoints.up("xl"));

    const chains = [
        { value: 0, name: "BNB", icon: BinanceIcon, color: "#F5CA0F" },
        { value: 1, name: "Abstract", icon: AbstractIcon, color: "#fff" },
    ];

    const notificationBar = <Box bgcolor={customColors.green} sx={{display: "flex", justifyContent: 'center', alignItems: "center"}}>
                <Avatar sx={{width: 20, height: 20, mr: 2}}>S</Avatar>
                <Typography textAlign={"center"}>Someone bought 4 BNB of Bert | MC $50.61K</Typography>
            </Box>
    
    return <>
        {
            !isBigScreen && 
            notificationBar
        }
        <AppBar position="static" sx={{display: "flex", flexDirection: "row", paddingX: 2, paddingY: 1, maxHeight: 60}}>
            <Box display={"flex"} alignItems={"center"} width={300}>
                <Avatar src={Calque} />
                <Typography variant="h5" sx={{marginLeft: 1, display: {xs: "none", sm: "block"}, fontSize: {md: 15, lg: 25}}}>Bull ’n Bear</Typography>
            </Box>
            {
                isDesktop &&
                <Box display={"flex"} alignItems={"center"}>
                    <StyledMenuItem>HOME</StyledMenuItem>
                    <StyledMenuItem>TRENDING</StyledMenuItem>
                    <StyledMenuItem>WATCHLIST</StyledMenuItem>
                    <StyledMenuItem>CREATE</StyledMenuItem>
                </Box>
            }
            <Box flexGrow={"1"} p={3} borderRadius={50}>
                {isBigScreen && notificationBar}
            </Box>
            <Box display={"flex"} alignItems={"center"}>
                <Autocomplete
                    freeSolo
                    sx={{minWidth: { xs:150, sm: 300 }}}
                    disableClearable
                    options={["USDT"].map((option) => option)}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder={isDesktop? "Search by name, ticker, or contract..": "Search for tokens..."}
                        slotProps={{
                            input: {
                                ...params.InputProps,
                                type: 'search',
                                startAdornment: <SearchIcon />,
                                style: {
                                    height: 40,
                                    fontSize: 12
                                }
                            },
                        }}
                    />
                    )}
                />
            </Box>
            {
                isDesktop &&
                <Box display={"flex"} alignItems={"center"} marginX={1}>
                    <SettingsIcon style={{cursor: "pointer"}} />
                </Box>
            }
            <FormControl sx={{minWidth: isDesktop? 150: 50, display: "flex", alignItems: 'center', justifyContent: "center"}}>
                <Select
                    value={selectedChain}
                    onChange={(e) => setSelectedChain(e.target.value)}
                    displayEmpty
                    renderValue={(value) => {
                        const chain = chains.find((c) => c.value === value);
                        return chain ? (
                            isDesktop? <><Avatar src={chain.icon} sx={{ width: 24, height: 24, mr: 1 }} />
                            <StyledMenuItem sx={{ color: chain.color }}>{chain.name}</StyledMenuItem></>: <Avatar src={chain.icon} sx={{ width: 24, height: 24 }} />
                        ) : (
                            "Select Chain"
                        );
                    }}
                    sx={{
                        ".MuiSelect-select": {
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#15171C",
                            borderColor: "#22242D",
                            transition: "none",
                            padding: 0,
                            py: 1
                        },
                        ".MuiSelect-select.MuiSelect-outlined.MuiInputBase-input.MuiOutlinedInput-input": {
                            height: "100%",
                            backgroundColor: "inherit"
                        },
                        ".Mui-focused": {
                            borderColor: "black",
                        },
                        ".MuiSvgIcon-root": {
                            top: "calc(77% - 0.5em)",
                            left: "calc(72% - 0.5em)"
                        },
                        display: "inline",
                        width: isDesktop ? 100: 40,
                        height: "100%"
                    }}
                    IconComponent={KeyboardArrowDownIcon}
                >
                {chains.map((chain) => (
                    <MenuItem key={chain.value} value={chain.value}>
                        <Avatar src={chain.icon} sx={{ width: 24, height: 24, mr: 1 }} />
                        <StyledMenuItem sx={{ color: chain.color }}>{chain.name}</StyledMenuItem>
                    </MenuItem>
                ))}
            </Select>
            </FormControl>
            <Box display={"flex"} alignItems={"center"} marginX={1} sx={{
                "div": {
                    height: "90%"
                }
            }}>
                <CustomConnectButton styles={{fontSize: 10, paddingX: 0, height: "100%"}} />
            </Box>
            {
                !isDesktop &&
                <div>
                    <Button variant="contained" sx={{minWidth: 2}} color="primary" onClick={() => toggleDrawer(true)} >
                        <SegmentIcon sx={{color: "white"}} />
                    </Button>
                    <Drawer anchor="right" open={drawerOpened} onClose={() => toggleDrawer(false)}>
                        <Box
                            role="presentation"
                            onClick={() => toggleDrawer(false)}
                            onKeyDown={() => toggleDrawer(false)}
                        >
                            <List>
                                <ListItem>
                                    <ListItemButton>
                                        <StyledMenuItem>HOME</StyledMenuItem>
                                    </ListItemButton>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton>
                                        <StyledMenuItem>TRENDING</StyledMenuItem>
                                    </ListItemButton>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton>
                                        <StyledMenuItem>WATCHLIST</StyledMenuItem>
                                    </ListItemButton>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton>
                                        <StyledMenuItem>CREATE</StyledMenuItem>
                                    </ListItemButton>
                                </ListItem>
                            </List>
                        </Box>
                    </Drawer>
                </div>
            }
        </AppBar>
    </>
}