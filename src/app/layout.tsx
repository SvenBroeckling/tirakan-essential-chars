import "@mantine/core/styles.css";
import "./globals.css";

import { ColorSchemeScript, MantineProvider, createTheme, mantineHtmlProps } from "@mantine/core";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tirakan Charaktere",
  description: "Öffentliche Charakterbögen für ein Dark-Fantasy-Rollenspiel",
};

const theme = createTheme({
  primaryColor: "red",
  defaultRadius: 6,
  fontFamily: 'Georgia, "Times New Roman", serif',
  headings: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontWeight: "700",
  },
  colors: {
    red: [
      "#fff0eb",
      "#f2d7ce",
      "#dfa99b",
      "#ce7a67",
      "#bf513a",
      "#b63a24",
      "#9b2f20",
      "#7d271d",
      "#642319",
      "#3a130d",
    ],
  },
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body>
        <MantineProvider defaultColorScheme="light" theme={theme}>
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
