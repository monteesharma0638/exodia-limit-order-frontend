import type { IERC20 } from "./IERC20"

export interface ISelectPair {
    tokenIn: IERC20,
    tokenOut: IERC20
}

export interface ISelectPairContextArgs {
    tokenPair: ISelectPair,
    SelectionBoxes: () => React.JSX.Element
}