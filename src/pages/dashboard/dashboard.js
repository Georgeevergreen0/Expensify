import React, { useState, useMemo, useEffect } from "react";
import Layout from "layout/layout";
import { CSVLink } from "react-csv";
import { format } from 'date-fns';
import { Box, Chip, Stack, Loader, Typography, Card, Divider, Grid, Fab, Select, MenuItem } from "components";
import { useGetAllFieldQuery, useGetAllTransactionsQuery } from "services/queries";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { numberFormat } from "util";
import startOfMonth from 'date-fns/startOfMonth';
import subMonths from 'date-fns/subMonths';
import CircleIcon from '@mui/icons-material/Circle';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BalanceIcon from '@mui/icons-material/Balance';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import css from "./dashboard.module.scss";

import {
    shallowEqual,
    useSelector,
} from "react-redux";
import { authSelector } from "state/auth";

const headers = [
    { label: "Date", key: "date" },
    { label: "Author", key: "author" },
    { label: "Author Email", key: "email" },
    { label: "Price", key: "price" },
    { label: "Description", key: "description" },
    { label: "Type", key: "type" }
];


function Home() {
    const { user } = useSelector(authSelector, shallowEqual);
    const [period, setPeriod] = useState("1month");
    const [filter, setFilter] = useState(startOfMonth(new Date()));
    const [filterField, setFilterField] = useState("");

    const { data: fieldData } = useGetAllFieldQuery();
    const { data } = useGetAllTransactionsQuery(user);

    const pageData = useMemo(() => {
        if (data) {
            return data.filter(transaction => {
                return new Date(transaction.date) > new Date(filter)
            }).filter((transaction) => {
                const filterId = transaction.fieldId || "";
                return filterId?.includes(filterField)
            });;
        } else {
            return null;
        }

    }, [data, filter, filterField])

    const csvData = useMemo(() => {
        if (pageData) {
            return pageData.map((transaction) => {
                return ({
                    date: format(new Date(transaction?.date), "dd/MM/yyyy"),
                    author: transaction.author.displayName,
                    email: transaction.author.email,
                    price: `₦ ${numberFormat(transaction.price)}`,
                    description: transaction.description,
                    type: transaction.type
                })
            })
        } else {
            return [];
        }
    }, [pageData])

    const income = useMemo(() => {
        if (pageData) {
            return pageData.filter(transaction => {
                return transaction.type === "income"
            });
        } else {
            return null;
        }
    }, [pageData])

    const incomeTotal = useMemo(() => {
        if (income) {
            return income.reduce((acc, current) => acc + current.price, 0)
        } else {
            return null;
        }
    }, [income])

    const expense = useMemo(() => {
        if (pageData) {
            return pageData.filter(transaction => {
                return transaction.type === "expense"
            });
        } else {
            return null;
        }
    }, [pageData])

    const expenseTotal = useMemo(() => {
        if (expense) {
            return expense.reduce((acc, current) => acc + current.price, 0)
        } else {
            return null;
        }
    }, [expense])





    useEffect(() => {
        switch (period) {
            case "1month":
                const date1 = startOfMonth(new Date());
                setFilter(date1);
                break;
            case "3month":
                const date3 = startOfMonth(subMonths(new Date(), 3));
                setFilter(date3);
                break;
            case "6month":
                const date6 = startOfMonth(subMonths(new Date(), 6));
                setFilter(date6);
                break;
            case "12month":
                const date12 = startOfMonth(subMonths(new Date(), 12));
                setFilter(date12);
                break;
            case "all":
                setFilter(new Date(0));
                break;
            default:
                break;
        }
    }, [period])

    return (
        <Layout>
            <Box>
                <Typography variant="h3" sx={{ mb: "30px" }}>Dashboard</Typography>
                {pageData && fieldData ? (
                    <>
                        <Box sx={{ mb: "30px" }}>
                            <Stack direction="row" spacing={1} className={css.sliderContainer}>
                                <Chip label="Month" color="primary" variant={period === "1month" ? "filled" : "outlined"} onClick={() => setPeriod("1month")} />
                                <Chip label="3-Month" color="primary" variant={period === "3month" ? "filled" : "outlined"} onClick={() => setPeriod("3month")} />
                                <Chip label="6-Month" color="primary" variant={period === "6month" ? "filled" : "outlined"} onClick={() => setPeriod("6month")} />
                                <Chip label="Year" color="primary" variant={period === "12month" ? "filled" : "outlined"} onClick={() => setPeriod("12month")} />
                                <Chip label="All" color="primary" variant={period === "all" ? "filled" : "outlined"} onClick={() => setPeriod("all")} />
                            </Stack>

                        </Box>
                        <Box className={css.filter}>
                            <Typography variant="h6">Filter field</Typography>
                            <Select
                                displayEmpty
                                fullWidth
                                placeholder="Select associated field for this transaction"
                                size="small"
                                value={filterField}
                                onChange={(e) => setFilterField(e.target.value)}
                            >
                                <MenuItem value="">All</MenuItem>
                                {fieldData && fieldData.map((value) => (
                                    <MenuItem value={value.fieldId}>{value.name}</MenuItem>
                                ))}
                            </Select>
                        </Box>
                        {pageData.length === 0 && (
                            <Typography align="center" variant="h4">No transaction to show</Typography>
                        )}
                        {pageData.length > 0 && (
                            <Box>
                                <Card className={css.card}>
                                    <Typography variant="h6" sx={{ my: 2 }}>Financial Activiy</Typography>
                                    <Divider sx={{ width: "100%", mb: 1 }} />
                                    <Box className={css.chartContainer}>
                                        <ResponsiveContainer width="100%" height="100%" >
                                            <PieChart>
                                                <Pie
                                                    data={[
                                                        { name: 'Expense', value: expenseTotal },
                                                        { name: 'Income', value: incomeTotal },
                                                    ]}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius="40%"
                                                    outerRadius="95%"
                                                    startAngle={90}
                                                    endAngle={450}
                                                    dataKey="value"
                                                >
                                                    <Cell fill="#d32f2f" />
                                                    <Cell fill="#2e7d32" />
                                                </Pie>
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </Box>
                                    <Divider sx={{ width: "100%", mb: 1 }} />
                                    <Box>
                                        <Box className={css.align}> <CircleIcon sx={{ color: "success.main", mr: 2 }} /> <Typography variant="h6">Income</Typography></Box>
                                        <Box className={css.align}> <CircleIcon sx={{ color: "error.main", mr: 2 }} /> <Typography variant="h6">Expense</Typography></Box>
                                    </Box>
                                </Card>


                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Card className={css.textCard}>
                                            <AttachMoneyIcon className={css.icon} sx={{ color: "success.main" }} />
                                            <Box>
                                                <Typography variant="h3">Income</Typography>
                                                <Typography variant="body2">Total transactions: {income.length}</Typography>
                                                <Typography variant="h6" sx={{ color: "success.main" }}>₦ {numberFormat(incomeTotal)}</Typography>
                                            </Box>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Card className={css.textCard}>
                                            <MoneyOffIcon className={css.icon} sx={{ color: "error.main" }} />
                                            <Box>
                                                <Typography variant="h3">Expense</Typography>
                                                <Typography variant="body2">Total transactions: {expense.length}</Typography>
                                                <Typography variant="h6" sx={{ color: "error.main" }}>₦ {numberFormat(expenseTotal)}</Typography>
                                            </Box>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Card className={css.textCard}>
                                            <BalanceIcon className={css.icon} sx={{ color: (incomeTotal - expenseTotal) >= 0 ? "success.main" : "error.main" }} />
                                            <Box>
                                                <Typography variant="h3">Net</Typography>
                                                <Typography variant="body2">Total transactions: {pageData.length}</Typography>
                                                <Typography variant="h6" sx={{ color: (incomeTotal - expenseTotal) >= 0 ? "success.main" : "error.main" }}>₦ {numberFormat(Math.abs(incomeTotal - expenseTotal))}</Typography>
                                            </Box>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}
                    </>
                ) : (
                    <Loader />
                )}
            </Box>

            <CSVLink className={css.fab} headers={headers} data={csvData} filename={"Expensify.csv"} >
                <Fab color="primary" component="span">
                    <FileDownloadIcon />
                </Fab>
            </CSVLink>

        </Layout>
    );
}

export default Home;