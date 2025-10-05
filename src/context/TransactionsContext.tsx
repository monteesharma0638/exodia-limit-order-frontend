import React, { type PropsWithChildren } from "react"
import { useParams } from "react-router-dom";

export const TransactionsContext = React.createContext(null);

export function TransactionsContextProvider({children}: PropsWithChildren) {
    const { makerAsset, takerAsset } = useParams();
    
    return (
        <TransactionsContext.Provider value={null}>
            {children}
        </TransactionsContext.Provider>
    )
}