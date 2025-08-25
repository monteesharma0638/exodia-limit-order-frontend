import React, { Children, useMemo, useState, type PropsWithChildren } from "react";
import type { IERC20 } from "../interface/IERC20";
import { zeroAddress } from "viem";
import type { ISelectPair, ISelectPairContextArgs } from "../interface/ISelectPair";
import { Box, CircularProgress, createStyles, FormControl, IconButton, MenuItem, Select } from "@mui/material";
import styled from "styled-components";
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

const defaultTokenIn: IERC20 = {
	name: "ETH",
	symbol: "eth",
	decimals: 18,
	ticker: "eth",
	address: zeroAddress
}

const defaultTokenOut: IERC20 = {
	name: "DAI",
	symbol: "dai",
	decimals: 18,
	ticker: 'eth',
	address: "0x0629Ab14A041F7600465C3E3eA33c019DbAB23B1"
}

const StyledSelect = styled(Select)({
	display: "inline",
	// width: "200px"
})

const StyledFormControl = styled(FormControl)({
	display: "inline",
	width: "200px"
})

const defaultTokenPair: ISelectPair = { tokenIn: defaultTokenIn, tokenOut: defaultTokenOut }

export const SelectPairContext = React.createContext<ISelectPairContextArgs>({ tokenPair: defaultTokenPair, SelectionBoxes: () => <CircularProgress /> });

export default function SelectPair({ children }: PropsWithChildren) {
	const [tokenInIndex, setTokenInIndex] = useState(0);
	const [tokenOutIndex, setTokenOutIndex] = useState(1);

	const options = [
		defaultTokenIn,
		defaultTokenOut
	].map((value, index) => ({ ...value, index }));

	const tokenPair = useMemo(() => ({
		tokenIn: options[tokenInIndex],
		tokenOut: options[tokenOutIndex]
	}), [tokenInIndex, tokenOutIndex])

	const SelectionBoxes = () => {
		return (
			<Box sx={{display: "flex"}}>
				<StyledFormControl>
					<StyledSelect defaultValue={tokenInIndex} onChange={e => setTokenInIndex(Number(e.target.value))}>
						{
							options.filter(value => tokenPair.tokenOut.address != value.address)
								.map((value) => (
									<MenuItem key={value.index} value={value.index}> {value.name} </MenuItem>
								))
						}
					</StyledSelect>
				</StyledFormControl>
				<IconButton sx={{alignSelf: "center"}}>
					<SwapHorizIcon />
				</IconButton>
				<StyledFormControl>
					<StyledSelect defaultValue={tokenOutIndex} onChange={e => setTokenOutIndex(Number(e.target.value))}>
						{
							options.filter(value => tokenPair.tokenIn.address != value.address).map((value) => (
								<MenuItem key={value.index} value={value.index}> {value.name} </MenuItem>
							))
						}
					</StyledSelect>
				</StyledFormControl>
			</Box>
		)
	}

	return (
		<SelectPairContext.Provider value={{ tokenPair, SelectionBoxes }}>
			{children}
		</SelectPairContext.Provider>
	)
}