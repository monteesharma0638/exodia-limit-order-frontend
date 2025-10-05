import './App.css';
import Orders from './pages/Orders';
import { ThemeProvider } from '@emotion/react';
import theme from './theme';
import RainbowKit from './providers/RainbowKit';
import ContextProvider from './context/ContextProvider';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Trade from './pages/Trade';
import { StyledEngineProvider } from '@mui/material';

const router = createBrowserRouter([
{
  path: "trade",
  Component: Trade
},
{
  path: "limit/:makerAsset/:takerAsset",
  Component: Orders
},
])

function App() {

  return (
    <>
      <ThemeProvider theme={theme}>
        <StyledEngineProvider injectFirst>
          <RainbowKit>
            <ContextProvider>
              <RouterProvider router={router} />
            </ContextProvider>
          </RainbowKit>
        </StyledEngineProvider>
      </ThemeProvider>
    </>
  )
}

export default App
