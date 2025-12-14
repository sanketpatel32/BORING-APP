"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/react";
import { ChakraProvider } from "@chakra-ui/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider as MUIThemeProvider, createTheme } from "@mui/material/styles";

const muiTheme = createTheme({
  palette: {
    mode: "light",
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider>
      <NextUIProvider>
        <MUIThemeProvider theme={muiTheme}>
          <CssBaseline />
          {children}
        </MUIThemeProvider>
      </NextUIProvider>
    </ChakraProvider>
  );
}
