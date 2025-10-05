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
    padding: 0
})

const errorColor = theme.palette.error.main;
const successColor = theme.palette.success.main;

const entries = [
    ["Honeypot", "no", successColor],
    ["Reannounced", "no", errorColor],
    ["Can Steal fees", "no", successColor],
    ["Can Self-destruct", "no", successColor],
    ["Has proxy functions", "no", successColor],
    ["Can issue additional tokens", "no", successColor],
    ["Has allowlist", "no", successColor],
    ["Has blocklist", "no", successColor],
    ["Can terminate txn's", "no", successColor],
    ["Has allowlist", "no", successColor],
]

function formatEntries(entries: string[][]) {
    return entries.map(value => ({
        label: value[0],
        value: value[1],
        color: value?.[2]
    }))
}

export default function AuditCard() {
    return (
        <Card sx={{p: 8, m: 2}}>
            <Typography>Audit</Typography>
            <StyledTableRow>
                <StyledTableCell>Summary</StyledTableCell>
                <TableCell sx={{p:2}}> 9/10 </TableCell>
            </StyledTableRow>
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