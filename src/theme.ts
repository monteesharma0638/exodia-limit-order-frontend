import { createTheme } from "@mui/material";


export const primaryFont = "designer, regular";
export const secondaryFont = "Space Grotesk, Medium";
export const customColors = {
    green: "#03FFA3"
};

const theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#ffff",
            dark: "#22242D"
        },
        secondary: {
            main: "#6C7380",
            dark: "#22242D"
        },
        background: {
            paper: "#07090F"
        }
    },
    typography: {
        h1: {
            fontFamily: primaryFont
        },
        h4: {
            fontFamily: primaryFont
        },
        h5: {
            fontFamily: primaryFont
        },
        h6: {
            fontFamily: primaryFont
        },
        fontFamily: secondaryFont,
    },
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-notchedOutline": {
                        transition: "none",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "inherit", // no highlight color
                        borderWidth: "1px",
                    },
                },
            },
        },
    },
    spacing: 1
})


export default theme;