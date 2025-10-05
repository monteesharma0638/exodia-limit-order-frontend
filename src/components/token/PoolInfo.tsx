import { Card, TableCell, TableRow, Typography } from "@mui/material";
import styled from "styled-components";
import theme from "../../theme";

const StyledTableRow = styled(TableRow)({
    display: "flex"
})

const StyledTableCell = styled(TableCell)({
    flexGrow: 1,
    padding: 2
})

const TableCellWithoutBorder = styled(StyledTableCell)({
    borderBottom: "none",
    fontSize: 12,
    color: theme.palette.secondary.main
})

const TableCellEndWithoutBorder = styled(TableCell)({
    borderBottom: "none",
    fontSize: 12,
    padding: 0,
    color: theme.palette.secondary.main
})

const entries = [
    ["Total liquidity", "$23.99K"],
    ["Total supply", "1B"],
    ["Pair", "0xbee...108"],
    ["Token creator", "0xbee...108"],
    ["Pool created", "04/08/2025 12:59"]
]

function formatEntries(entries: string[][]) {
    return entries.map(value => ({
        label: value[0],
        value: value[1],
        color: value?.[2]
    }))
}

export default function PoolInfo() {
    return (
        <Card sx={{p: 8, m: 2}}>
            <Typography>Pool Info</Typography>
            {
                formatEntries(entries).map(value => (
                    <StyledTableRow>
                        <TableCellWithoutBorder>{value.label}</TableCellWithoutBorder>
                        <TableCellEndWithoutBorder sx={{color: value.color}}>{value.value}</TableCellEndWithoutBorder>
                    </StyledTableRow>
                ))
            }
        </Card>
    )
}