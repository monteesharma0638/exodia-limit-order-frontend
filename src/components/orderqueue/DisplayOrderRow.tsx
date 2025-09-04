import { Skeleton, TableCell, TableRow, Typography } from "@mui/material";
import type { IOrderBookSupabaseResponse } from "../../interface/ISupabase";
import { useToken } from "wagmi";
import { formatUnits } from "ethers";

export default function DisplayOrderRow({order}: {order: IOrderBookSupabaseResponse}) {
    const {data: maker} = useToken({
        address: order.makerAsset
    });

    const {data: taker} = useToken({
        address: order.takerAsset
    })
    
    const formattedMakingAmount = formatUnits(order.makingAmount, Number(maker?.decimals ?? 18));
    const makerSymbol = maker?.symbol ? maker.symbol: <Skeleton variant="text" sx={{display: "inline-block", width: 20}} />;
    const takerSymbol = taker?.symbol ? taker.symbol: <Skeleton variant="text" sx={{display: "inline-block", width: 20}} />;

    return <TableRow key={order.salt}>
                <TableCell>
                    {formattedMakingAmount} {makerSymbol}
                </TableCell>
                <TableCell>
                    {order.price} ({makerSymbol} / {takerSymbol})
                </TableCell>
                <TableCell>
                    <Typography color="primary">{new Date(order.created_at).toDateString()}</Typography>
                    <Typography color="primary">{new Date(order.created_at).toTimeString()}</Typography>
                </TableCell>
            </TableRow>
}