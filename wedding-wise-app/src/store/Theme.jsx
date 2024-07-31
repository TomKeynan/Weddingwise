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
      error: {
        main: "#c21710",
        light: "#e02c1d",
        dark: "#b40000",
        contrastText: "white",
      },
      black: {
        main: "#000",
      },
    },
    colorBg: {
      main: "linear-gradient(220deg, rgba(218,212,251,1) 90%, rgba(247,244,255,1) 60%, rgba(253,250,255,1) 70%)",
      threeColors:
        "linear-gradient(165deg, rgba(255,255,255,0.9) 60%, rgba(255,214,135,0.6) 60%, rgba(227,220,252,0.8) 85%);",
      footer:
        "linear-gradient(160deg, rgba(255,255,255,0.6) 50%, rgba(255,214,135,0.6) 75%, rgba(227,220,252,0.65) 90%)",
    },
    shadow: {
      main: "0px 15px 15px -3px rgba(0,0,0,0.1)",
      strong:
        "0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)",
      footer: "inset 0px 15px 35px -3px rgba(0,0,0,0.1);",
    },
    font: {
      main: "Varela Round",
    },
    supplier: {
      colors: {
        primary: {
          //pink
          light: "#f7caf4",
          main: "#D740F6",
          dark: "#BC5BB4",
        },
        secondary: {
          //green
          light: "#E0F5E1",
          main: "#B2E6B5",
          dark: "#70AE91",
        },
      },
      colorBg: {
        main: "linear-gradient(180deg, rgba(224,245,225,1) 80%, rgba(255,255,255,1) 60%)",
        // main: "linear-gradient(240deg, rgba(255,255,255,1) 65%, rgba(247,244,255,1) 80%)",
        footer:
          "linear-gradient(135deg, rgba(255,255,255,1) 13%, rgba(247,202,244,1) 60%, rgba(224,245,225,1) 81%);",
      },
    },
  },
  heIL
);

export default function CustomThemeProvider({ children }) {
  return <ThemeProvider theme={customTheme}>{children}</ThemeProvider>;
}
