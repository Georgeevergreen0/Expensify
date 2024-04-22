import React, { useState, useMemo, useEffect } from "react";
import Layout from "layout/layout";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { format } from 'date-fns';
import * as yup from "yup";
import { Dialog, DialogContent, DialogActions, DialogTitle, Grid, Input, DatePicker, Box, Button, Fab, Chip, Stack, Loader, TableContainer, Table, TableBody, TableHead, TableRow, TableCell, Paper, Avatar, IconButton, Menu, MenuItem, Typography, TableFooter, FormControl, Select, FormLabel } from "components";
import { addExpense, updateExpense, deleteTransaction } from "services/firebase";
import { useGetAllFieldQuery, useGetAllExpenseQuery } from "services/queries";
import { numberFormat } from "util";
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import css from "./expense.module.scss";
import startOfMonth from 'date-fns/startOfMonth'
import subMonths from 'date-fns/subMonths';
import {
    shallowEqual,
    useSelector,
} from "react-redux";
import { authSelector } from "state/auth";


const schema = yup.object().shape({
    date: yup.string().required("Date is required"),
    price: yup.number().min(0).required("Price is required"),
    description: yup.string().required("Description is required"),
    fieldId: yup.string(),
});



function Home() {
    const { user } = useSelector(authSelector, shallowEqual);
    const [period, setPeriod] = useState("1month");
    const [filter, setFilter] = useState(startOfMonth(new Date()));
    const [filterField, setFilterField] = useState("");

    const [openForm, setOpenForm] = useState(false);
    const [openDeleteForm, setOpenDeleteForm] = useState(false);
    const [activeTransaction, setActiveTransaction] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [initialValues, setInitialValues] = useState({
        date: null,
        price: "",
        description: "",
        fieldId: ""
    });
    const [anchorEl, setAnchorEl] = useState(null);


    const { data: fieldData } = useGetAllFieldQuery();
    const { data, refetch } = useGetAllExpenseQuery(user);

    const pageData = useMemo(() => {
        if (data) {
            return data.filter(transaction => {
                return new Date(transaction.date) > new Date(filter)
            }).filter((transaction) => {
                const filterId = transaction.fieldId || "";
                return filterId?.includes(filterField)
            });
        } else {
            return null;
        }

    }, [data, filter, filterField])


    const formik = useFormik({
        enableReinitialize: true,
        validateOnMount: true,
        validationSchema: schema,
        initialValues: initialValues,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                if (values?.transactionId) {
                    //update
                    await updateExpense(values);
                    toast.success("Updated successfully");
                } else {
                    //add
                    await addExpense(values);
                    toast.success("Created successfully");
                }
                refetch();
                handleClose();
            } catch (error) {
                toast.error(error.message);
                setSubmitting(false);
            }

        },
    });

    const handleClickAdd = () => {
        setOpenForm(true);
        setInitialValues(
            {
                date: null,
                price: "",
                description: "",
                fieldId: ""
            }
        )
    };

    const handleClickEdit = () => {
        setOpenForm(true);
        setInitialValues(activeTransaction);
    };

    const handleClickDelete = () => {
        setOpenDeleteForm(true);
    };

    const handleClose = () => {
        formik.resetForm();
        setActiveTransaction(null)
        setOpenForm(false);
        setOpenDeleteForm(false);
    };


    const handleOpenMenu = (event, activeTransaction) => {
        setAnchorEl(event.currentTarget);
        setActiveTransaction(activeTransaction);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };


    const handleClickConfirmDelete = async () => {
        try {
            setIsDeleting(true);
            await deleteTransaction(activeTransaction);
            refetch();
            setOpenDeleteForm(false);
            setIsDeleting(false);
            toast.success("Deleted successfully");
        } catch (error) {
            toast.error(error.message);
            setIsDeleting(false);
        }
    };


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
                <Typography variant="h3" sx={{ mb: "30px" }}>Expenses</Typography>
                {pageData && fieldData ? (
                    <>
                        <Box>
                            <Typography className={css.transaction}>Total transactions: {pageData.length}</Typography>
                            <Stack direction="row" spacing={1} className={css.sliderContainer}>
                                <Chip label="Month" color="primary" variant={period === "1month" ? "filled" : "outlined"} onClick={() => setPeriod("1month")} />
                                <Chip label="3-Month" color="primary" variant={period === "3month" ? "filled" : "outlined"} onClick={() => setPeriod("3month")} />
                                <Chip label="6-Month" color="primary" variant={period === "6month" ? "filled" : "outlined"} onClick={() => setPeriod("6month")} />
                                <Chip label="Year" color="primary" variant={period === "12month" ? "filled" : "outlined"} onClick={() => setPeriod("12month")} />
                                <Chip label="All" color="primary" variant={period === "all" ? "filled" : "outlined"} onClick={() => setPeriod("all")} />
                            </Stack>
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
                        </Box>
                        {pageData.length === 0 && (
                            <Typography align="center" variant="h4">No transaction to show</Typography>
                        )}
                        {pageData.length > 0 && (
                            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                                <TableContainer component={Paper} sx={{ maxHeight: "calc(100vh - 100px)", }}>
                                    <Table sx={{ minWidth: 650 }} size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ width: 100 }}> Date</TableCell>
                                                <TableCell sx={{ width: 100 }}> Author</TableCell>
                                                <TableCell align="center" sx={{ width: 80 }}> Image</TableCell>
                                                <TableCell align="right" sx={{ width: 150 }}>Price (Niara)</TableCell>
                                                <TableCell>Description</TableCell>
                                                <TableCell>Field</TableCell>
                                                <TableCell sx={{ width: 80 }} align="right">Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {pageData.map((transaction) => (
                                                <TableRow key={transaction.transactionId}>
                                                    <TableCell component="th" scope="row">
                                                        {format(new Date(transaction?.date), "dd/MM/yyyy")}
                                                    </TableCell>
                                                    <TableCell>{transaction.author.displayName}</TableCell>
                                                    <TableCell align="center"><Avatar src={transaction.author.photoURL} /></TableCell>
                                                    <TableCell align="right" sx={{ color: "error.main" }}>₦ {numberFormat(transaction.price)}</TableCell>
                                                    <TableCell>{transaction.description}</TableCell>
                                                    <TableCell>{fieldData.find((field) => field.fieldId === transaction.fieldId)?.name || "None"}</TableCell>
                                                    <TableCell align="right">
                                                        <IconButton onClick={(event) => handleOpenMenu(event, transaction)}>
                                                            <MoreVertIcon color="primary" />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                        <TableFooter sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableRow>
                                                <TableCell component="th" scope="row">Total</TableCell>
                                                <TableCell></TableCell>
                                                <TableCell align="center"></TableCell>
                                                <TableCell align="right" sx={{ color: "error.main" }}>₦ {numberFormat(pageData.reduce((acc, transaction) => acc + transaction.price, 0))}</TableCell>
                                                <TableCell></TableCell>
                                                <TableCell></TableCell>
                                                <TableCell align="right"></TableCell>
                                            </TableRow>
                                        </TableFooter>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        )}
                    </>
                ) : (
                    <Loader />
                )}
            </Box>


            {fieldData && <Fab color="primary" aria-label="add" onClick={handleClickAdd} className={css.fab}>
                <AddIcon />
            </Fab>}

            <Dialog open={openForm} onClose={handleClose} fullWidth>
                <DialogTitle>Expense</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <DatePicker
                                fullWidth
                                placeholder="DD/MM/YYYY"
                                maxDate={new Date()}
                                error={Boolean(formik.touched.date && formik.errors.date)}
                                selected={formik.values.date ? new Date(formik.values.date) : null}
                                onChange={date => formik.setFieldValue("date", new Date(date).toString())}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Input
                                fullWidth
                                type="number"
                                placeholder="Enter price"
                                error={Boolean(formik.touched.price && formik.errors.price)}
                                {...formik.getFieldProps("price")}
                                endAdornment={
                                    <Input.EndAdornment>
                                        NG
                                    </Input.EndAdornment>
                                }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Input
                                fullWidth
                                placeholder="Enter description"
                                multiline
                                rows={4}
                                error={Boolean(formik.touched.description && formik.errors.description)}
                                {...formik.getFieldProps("description")}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl className={css.select} fullWidth>
                                <FormLabel>Select associated field for this transaction</FormLabel>
                                <Select
                                    displayEmpty
                                    fullWidth
                                    placeholder="Select associated field for this transaction"
                                    size="small"
                                    {...formik.getFieldProps("fieldId")}
                                >
                                    <MenuItem value="">None</MenuItem>
                                    {fieldData && fieldData.map((value) => (
                                        <MenuItem value={value.fieldId}>{value.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button disabled={formik.isSubmitting} onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" disabled={formik.isSubmitting} onClick={formik.submitForm}>{formik.isSubmitting ? "Submit..." : "Submit"}</Button>
                </DialogActions>
            </Dialog>

            {activeTransaction && (
                <Dialog open={openDeleteForm} onClose={handleClose} fullWidth>
                    <DialogTitle>Delete Expense</DialogTitle>
                    <DialogContent>
                        <Typography>
                            This entry will be permanently deleted
                        </Typography>
                        <br />
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ width: 100 }}> Date</TableCell>
                                        <TableCell sx={{ width: 100 }}> Author</TableCell>
                                        <TableCell align="center" sx={{ width: 80 }}> Image</TableCell>
                                        <TableCell align="right" sx={{ width: 150 }}>Price (Niara)</TableCell>
                                        <TableCell>Description</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">
                                            {format(new Date(activeTransaction?.date), "dd/MM/yyyy")}
                                        </TableCell>
                                        <TableCell>{activeTransaction.author.displayName}</TableCell>
                                        <TableCell align="center"><Avatar src={activeTransaction.author.photoURL} /></TableCell>
                                        <TableCell align="right">₦ {numberFormat(activeTransaction.price)}</TableCell>
                                        <TableCell>{activeTransaction.description}</TableCell>

                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </DialogContent>
                    <DialogActions>
                        <Button disabled={isDeleting} onClick={handleClose}>Cancel</Button>
                        <Button variant="contained" disabled={isDeleting} onClick={handleClickConfirmDelete}>{isDeleting ? "Delete..." : "Delete"}</Button>
                    </DialogActions>
                </Dialog>
            )}

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                onClick={handleCloseMenu}
            >
                <MenuItem onClick={handleClickEdit}>Edit</MenuItem>
                <MenuItem onClick={handleClickDelete}>Delete</MenuItem>
            </Menu>
        </Layout>
    );
}

export default Home;