import { Box, colors, Table, TableCell, TableHead, TableRow } from "@mui/material";

const CustomTableHead = (
    <TableHead>
        <TableRow>
            <TableCell sx={{color: colors.deepPurple[600], fontWeight: "bolder"}}>
                Amount
            </TableCell>
            <TableCell sx={{textAlign: "end", color: colors.deepPurple[600], fontWeight: "bolder"}}>
                Price
            </TableCell>
        </TableRow>
    </TableHead>
)

export default function OrderHistory() {
    return (
        <Box height={400} bgcolor={colors.cyan[100]}>
            <Table>
                {CustomTableHead}
            </Table>
        </Box>
    )
}