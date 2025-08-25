import type { PropsWithChildren } from "react";
import SelectPair from "./SelectedPair";

export default function ContextProvider({children}: PropsWithChildren) {
    return (
        <SelectPair>
            {children}
        </SelectPair>
    )
}