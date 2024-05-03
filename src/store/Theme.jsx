import { createTheme, ThemeProvider } from "@mui/material/styles";
import { heIL } from "@mui/x-date-pickers/locales";

export const customTheme = createTheme(
  {
    direction: "rtl",
    palette: {
      primary: {
        //orange
        main: "#FF9500",
        light: "#FEECC9",
        dark: "#DF8200",
        contrastText: "white",
      },
      secondary: {
        // purple
        main: "#DAD4FB",
        light: "#EFEAFF",
      },
      success: {
        main: "#66bb6a",
        light: "#a5d6a7",
        dark: "#388e3c",
      },
      black: {
        main: "#000",
      },
      // [theme.breakpoints.up('md')]: {
      //   fontSize: '2.4rem',
      // },
    },
    colorBg: {
      main: "linear-gradient(160deg, rgba(218,212,251,1) 90%, rgba(247,244,255,1) 70%, rgba(253,250,255,1) 90%)",
      footer:
        "linear-gradient(160deg, rgba(255,255,255,0) 38%, rgba(255,214,135,0.6) 75%, rgba(227,220,252,0.65) 90%)",
    },
    shadow: {
      main: "0px 15px 15px -3px rgba(0,0,0,0.1)",
      strong: "0px 25px 15px 5px rgba(0,0,0,0.2)",
    },
  },
  heIL
);

export default function CustomThemeProvider({ children }) {
  return <ThemeProvider theme={customTheme}>{children}</ThemeProvider>;
}
