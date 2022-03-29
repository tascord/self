
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "remix";
import type { MetaFunction } from "remix";
import { MantineProvider, ColorSchemeProvider, ColorScheme } from '@mantine/core';
import { useState } from "react";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "self",
  viewport: "width=device-width,initial-scale=1",
});

export const icon_size = 36;
export const scale = 0.65;

export default function App() {

  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const toggleColorScheme = async (value?: ColorScheme) => {

    const theme = value || (colorScheme === 'dark' ? 'light' : 'dark');

    // Update page
    setColorScheme(theme);

  }

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body style={{ padding: 0, margin: 0, minHeight: '100vh', maxWidth: "100vw" }}>
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
          <MantineProvider theme={{ colorScheme }}>
            <Outlet />
          </MantineProvider>
        </ColorSchemeProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html >
  );
}