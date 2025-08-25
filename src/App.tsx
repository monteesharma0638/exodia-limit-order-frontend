import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Orders from './pages/Orders';
import { ThemeProvider } from '@emotion/react';
import theme from './theme';
import RainbowKit from './providers/RainbowKit';
import ContextProvider from './context/ContextProvider';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([{
  path: "limit/:makerAsset/:takerAsset",
  Component: Orders
}])

function App() {

  return (
    <>
      <ThemeProvider theme={theme}>
        <RainbowKit>
          <ContextProvider>
            <RouterProvider router={router} />
          </ContextProvider>
        </RainbowKit>
      </ThemeProvider>
    </>
  )
}

export default App
