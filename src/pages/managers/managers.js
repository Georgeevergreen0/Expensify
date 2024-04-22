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
    Switch,
    IconButton,
    Input,
    Card,
    CardContent,
    CardMedia,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    Grid,
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    CircularProgress

} from "components";


import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import css from "./managers.module.scss";

import {
    shallowEqual,
    useSelector,
} from "react-redux";
import { authSelector } from "state/auth";
import { addAllowedUsers, deleteAllowedUsers, updateUser } from "services/firebase";
import { useGetAllowedUsersQuery, useGetAllUserQuery } from "services/queries"


const schema = yup.object().shape({
    email: yup.string().email().required("Email is required"),
});

function Home() {

    const { user } = useSelector(authSelector, shallowEqual);

    const [openForm, setOpenForm] = useState(false);
    const [openDeleteForm, setOpenDeleteForm] = useState(false);
    const [activeUser, setActiveUser] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdatingSwitch, setIsUpdatingSwitch] = useState(false);

    const { data: allowedUserData, refetch } = useGetAllowedUsersQuery();
    const { data, refetch: refetchUsers } = useGetAllUserQuery();

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
        initialValues: { email: "" },
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await addAllowedUsers(values);
                toast.success("Email added successfully");
                refetch();
                handleClose();
            } catch (error) {
                toast.error(error.message);
                setSubmitting(false);
            }

        },
    });


    const handleClose = () => {
        formik.resetForm();
        setActiveUser(null);
        setOpenForm(false);
        setOpenDeleteForm(false);
    };

    const handleClickDelete = (activeUser) => {
        setActiveUser(activeUser);
        setOpenDeleteForm(true);
    };

    const handleClickConfirmDelete = async () => {
        try {
            setIsDeleting(true);
            await deleteAllowedUsers(activeUser);
            await refetch();
            setOpenDeleteForm(false);
            setIsDeleting(false);
            toast.success("Email deleted successfully");
        } catch (error) {
            toast.error(error.message);
            setIsDeleting(false);
        }
    };

    const handleSwitchChange = async (event, user) => {
        try {
            setIsUpdatingSwitch(true);
            await updateUser(user.uid, { isAdmin: Boolean(event.target.checked) });
            await refetchUsers();
            setIsUpdatingSwitch(false);
            toast.success("Saved");
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <Layout>
            <Box>
                <Typography variant="h3" sx={{ mb: "30px" }}>Managers</Typography>
                {pageData ? (
                    <Grid container spacing={2} sx={{ mb: "30px" }}>
                        {pageData.map((registereduser) => (
                            <Grid item xs={12} md={6} key={registereduser.email}>
                                <Card sx={{ display: 'flex', mb: 1 }}>
                                    <CardMedia
                                        component="img"
                                        sx={{ width: 100, backgroundColor: "primary.main" }}
                                        image={registereduser.photoURL}
                                    />
                                    <CardContent sx={{ width: 'calc(100% - 100px)', p: "16px !important" }}>
                                        <Typography component="div" variant="h5" noWrap className={css.textTrans}>
                                            {registereduser.displayName}
                                        </Typography>
                                        <Typography variant="subtitle1" color="text.secondary" component="div" noWrap className={css.textTrans}>
                                            {registereduser.email}
                                        </Typography>
                                        {registereduser.email.toLowerCase() === "arnoldebuka214@gmail.com" ? (
                                            <Typography variant="subtitle1" color="text.secondary" component="div" noWrap className={css.textTrans}>
                                                <span style={{ marginBottom: "10px" }}>Owner</span>
                                            </Typography>
                                        ) : (
                                            <Typography variant="subtitle1" color="text.secondary" component="div" noWrap className={css.textTrans}>
                                                <span>Admin:</span>
                                                {user.email.toLowerCase() === "arnoldebuka214@gmail.com" ?
                                                    (
                                                        isUpdatingSwitch ? <CircularProgress /> : <Switch checked={Boolean(registereduser.isAdmin)} onChange={(event) => handleSwitchChange(event, registereduser)} />
                                                    ) : (
                                                        <span>{registereduser.isAdmin ? "True" : "False"}</span>
                                                    )
                                                }
                                            </Typography>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Loader />
                )}
            </Box>
            <Box>
                <Typography variant="h4" sx={{ mb: "30px" }}>Allowed Emails</Typography>
                {allowedUserData ? (
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 300 }} size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Emails</TableCell>
                                    {user.email.toLowerCase() === "arnoldebuka214@gmail.com" && <TableCell sx={{ width: 80 }} align="right">Action</TableCell>}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {allowedUserData.map((allowedUser) => (
                                    <TableRow key={allowedUser.allowedUserId}>
                                        <TableCell component="th" scope="row">
                                            {allowedUser.email}
                                        </TableCell>
                                        {user.email.toLowerCase() === "arnoldebuka214@gmail.com" && (
                                            <>
                                                {allowedUser.email.toLowerCase() === "arnoldebuka214@gmail.com" ? (
                                                    <TableCell align="right">
                                                        Owner
                                                    </TableCell>
                                                ) : (
                                                    <TableCell align="right">
                                                        <IconButton onClick={() => handleClickDelete(allowedUser)}>
                                                            <DeleteIcon color="primary" />
                                                        </IconButton>
                                                    </TableCell>
                                                )}
                                            </>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Loader />
                )}
            </Box>

            {user.email.toLowerCase() === "arnoldebuka214@gmail.com" && (
                <Fab color="primary" aria-label="add" className={css.fab} onClick={() => setOpenForm(true)}>
                    <AddIcon />
                </Fab>
            )}

            <Dialog open={openForm} onClose={handleClose} fullWidth>
                <DialogTitle>Add allowed email</DialogTitle>
                <DialogContent>
                    <Input
                        fullWidth
                        placeholder="Enter email address"
                        error={Boolean(formik.touched.email && formik.errors.email)}
                        {...formik.getFieldProps("email")}
                    />
                </DialogContent>
                <DialogActions>
                    <Button disabled={formik.isSubmitting} onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" disabled={formik.isSubmitting} onClick={formik.submitForm}>{formik.isSubmitting ? "Submit..." : "Submit"}</Button>
                </DialogActions>
            </Dialog>

            {activeUser && (
                <Dialog open={openDeleteForm} onClose={handleClose} fullWidth>
                    <DialogTitle>Allowed Emails</DialogTitle>
                    <DialogContent>
                        <Typography>
                            This email will not be able to login again!
                        </Typography>
                        <br />
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 300 }} size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Emails</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            {activeUser.email}
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
        </Layout>
    );
}

export default Home;