import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { Container, TableHead, TextField, styled } from '@mui/material';
import axios from 'axios';
import debounce from "lodash/debounce";

interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
        event: React.MouseEvent<HTMLButtonElement>,
        newPage: number,
    ) => void;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
        fontWeight: 600,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

function TablePaginationActions(props: TablePaginationActionsProps) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}

function SearchWithPagination() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [datas, setDatas] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [keyword, setKeyword] = useState('');

    const fetchData = async (pageIndex: number, limit: number, search: string = '') => {
        const apiEndpoint = `${process.env.REACT_APP_API_URL}`;
        const queryParams = {
            params: {
                page: pageIndex,
                limit: limit,
                search: search
            }
        }
        await axios.get(apiEndpoint, queryParams)
            .then((response) => {
                if (response.data) {
                    setDatas(response.data.data)
                    setTotal(response.data.total);
                }
            })
            .catch((error) => {
                console.log("error: ", error);
                setDatas([]);
                setTotal(0);
            });
    }

    useEffect(() => {
        fetchData(0, 5);
        return () => { };
    }, []);

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
        fetchData(newPage, rowsPerPage, keyword);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const newLimit = parseInt(event.target.value, 10);
        setRowsPerPage(newLimit);
        setPage(0);
        fetchData(0, newLimit, keyword);
    };

    const handleSearch = (query: string) => {
        setKeyword(query);
        fetchData(page, rowsPerPage, query);
    }

    const debouncedHandleSearch = useCallback(debounce(handleSearch, 1000), []);

    return (
        <Container maxWidth="lg" sx={{ p: 2 }}>
            <h2>React dynamic search</h2>
            <Box sx={{ mb: 2 }}>
                <TextField
                    label="Search"
                    id="outlined-size-small"
                    placeholder="Search: name, email"
                    defaultValue=""
                    size="small"
                    onChange={(e) => debouncedHandleSearch(e.target.value)}
                />
            </Box>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Name</StyledTableCell>
                            <StyledTableCell>Email</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {datas && datas.length !== 0 &&
                            (datas).map((row) => (
                                <TableRow key={row.first_name + '-' + row.last_name}>
                                    <TableCell component="th" scope="row">
                                        {row.first_name + ' ' + row.last_name}
                                    </TableCell>
                                    <TableCell>
                                        {row.email}
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                        {datas && datas.length === 0 &&
                            <TableRow key="no-data-available">
                                <TableCell colSpan={3} align="center">
                                    No data available
                                </TableCell>
                            </TableRow>
                        }
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={3}
                                count={total}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </Container>
    );
}

export default SearchWithPagination