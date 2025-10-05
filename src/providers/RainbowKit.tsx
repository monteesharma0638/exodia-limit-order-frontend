import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  bsc,
  localhost,
  abstract,
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import type { PropsWithChildren } from 'react';


export const config = getDefaultConfig({
  appName: 'EXODIA - limit orders',
  projectId: '54a7e6f3af9480ebfbdf4c23acde5231',
  chains: [abstract, bsc, localhost],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

export default function RainbowKit({children}: PropsWithChildren) {
    return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
    )
}