import React, { useState, useMemo, } from "react";
import Layout from "layout/layout";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as yup from "yup";
import {
    Box,
    Fab,
    Typography,
    Loader,
    IconButton,
    Input,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Menu,
    MenuItem

} from "components";


import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import css from "./fields.module.scss";

import {
    shallowEqual,
    useSelector,
} from "react-redux";
import { authSelector } from "state/auth";
import { addField, updateField, deleteField } from "services/firebase";
import { useGetAllFieldQuery } from "services/queries"


const schema = yup.object().shape({
    name: yup.string().required("Field name is required"),
});

function Home() {

    const { user } = useSelector(authSelector, shallowEqual);

    const [openForm, setOpenForm] = useState(false);
    const [openDeleteForm, setOpenDeleteForm] = useState(false);
    const [activeField, setActiveField] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [initialValues, setInitialValues] = useState({
        name: ""
    });

    const [anchorEl, setAnchorEl] = useState(null);

    const { data, refetch } = useGetAllFieldQuery();

    const pageData = useMemo(() => {
        if (data) {
            return data
        } else {
            return null;
        }
    }, [data])

    const formik = useFormik({
        enableReinitialize: true,
        validateOnMount: true,
        validationSchema: schema,
        initialValues: initialValues,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                if (values?.fieldId) {
                    //update
                    await updateField(values);
                    toast.success("Field Updated successfully");
                } else {
                    //add
                    await addField(values);
                    toast.success("Field added successfully");
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
                name: ""
            }
        )
    };


    const handleClickEdit = () => {
        setOpenForm(true);
        setInitialValues(activeField);
    };

    const handleClickDelete = () => {
        setOpenDeleteForm(true);
    };

    const handleClose = () => {
        formik.resetForm();
        setActiveField(null);
        setOpenForm(false);
        setOpenDeleteForm(false);
    };

    const handleOpenMenu = (event, activeField) => {
        setAnchorEl(event.currentTarget);
        setActiveField(activeField);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleClickConfirmDelete = async () => {
        try {
            setIsDeleting(true);
            await deleteField(activeField);
            await refetch();
            setOpenDeleteForm(false);
            setIsDeleting(false);
            toast.success("Field deleted successfully");
        } catch (error) {
            toast.error(error.message);
            setIsDeleting(false);
        }
    };

    return (
        <Layout>
            <Box>
                <Typography variant="h4" sx={{ mb: "30px" }}>Fields</Typography>
                {pageData ? (
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 300 }} size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Field Name</TableCell>
                                    <TableCell sx={{ width: 80 }} align="right">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pageData.map((field) => (
                                    <TableRow key={field.fieldId}>
                                        <TableCell component="th" scope="row">
                                            {field.name}
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton onClick={(event) => handleOpenMenu(event, field)}>
                                                <MoreVertIcon color="primary" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Loader />
                )}
            </Box>

            <Fab color="primary" aria-label="add" className={css.fab} onClick={handleClickAdd}>
                <AddIcon />
            </Fab>

            <Dialog open={openForm} onClose={handleClose} fullWidth>
                <DialogTitle>Add Field</DialogTitle>
                <DialogContent>
                    <Input
                        fullWidth
                        placeholder="Enter Field Name"
                        error={Boolean(formik.touched.email && formik.errors.email)}
                        {...formik.getFieldProps("name")}
                    />
                </DialogContent>
                <DialogActions>
                    <Button disabled={formik.isSubmitting} onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" disabled={formik.isSubmitting} onClick={formik.submitForm}>{formik.isSubmitting ? "Submit..." : "Submit"}</Button>
                </DialogActions>
            </Dialog>

            {activeField && (
                <Dialog open={openDeleteForm} onClose={handleClose} fullWidth>
                    <DialogTitle>Allowed Emails</DialogTitle>
                    <DialogContent>
                        <Typography>
                            This field will be deleted
                        </Typography>
                        <br />
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 300 }} size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Field</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            {activeField.name}
                                        </TableCell>
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