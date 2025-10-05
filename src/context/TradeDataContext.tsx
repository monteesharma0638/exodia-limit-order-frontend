import { useQuery } from "@tanstack/react-query";
import React, { useState, type PropsWithChildren } from "react"
import { useParams } from "react-router-dom";

export const TradeDataContext = React.createContext(null);

export function TradeDataContextProvider({children}: PropsWithChildren) {
    const { makerAsset, takerAsset } = useParams();
    
    return (
        <TradeDataContext.Provider value={null}>
            {children}
        </TradeDataContext.Provider>
    )
}