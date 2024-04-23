import React from "react";
import Layout from "layout/layout";
import { Select, Box, FormControl, Avatar, MenuItem, Typography } from "components";
import css from "./settings.module.scss";
import CircleIcon from '@mui/icons-material/Circle';
import {
    shallowEqual,
    useSelector,
    useDispatch
} from "react-redux";
import { authSelector } from "state/auth";
import { settingsSelector, setMode, setColor } from "state/settings";

function Home() {
    const dispatch = useDispatch();
    const { user } = useSelector(authSelector, shallowEqual);
    const { mode, color } = useSelector(settingsSelector, shallowEqual);

    const handleModeChange = (event) => {
        localStorage.setItem("mode", event.target.value)
        dispatch(setMode(event.target.value))
    };

    const handleColorChange = (event) => {
        localStorage.setItem("color", event.target.value)
        dispatch(setColor(event.target.value))
    };


    return (
        <Layout>
            <Box>
                <Typography variant="h3" sx={{ mb: "30px" }}>Settings</Typography>
                <Box className={css.content}>
                    <Avatar src={user.photoURL} className={css.image} />
                    <Typography align="center" className={css.textName}>{user.displayName}</Typography>
                    <Typography align="center" className={css.textEmail}>{user.email}</Typography>
                </Box>
                <Box className={css.content}>
                    <Box className={css.config}>
                        <Typography align="center" variant="h6">Theme Mode</Typography>
                        <FormControl className={css.select} >
                            <Select
                                size="small"
                                value={mode}
                                onChange={handleModeChange}
                                displayEmpty
                            >
                                <MenuItem value="light">Light</MenuItem>
                                <MenuItem value="dark">Dark</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box className={css.config}>
                        <Typography align="center" variant="h6">Theme Color</Typography>
                        <FormControl className={css.select} >
                            <Select
                                size="small"
                                value={color}
                                onChange={handleColorChange}
                                renderValue={(value) => <CircleIcon sx={{ fill: value }} />}
                            >
                                <MenuItem value="#d32f2f" ><CircleIcon sx={{ fill: "#d32f2f" }} /></MenuItem>
                                <MenuItem value="#1976d2" ><CircleIcon sx={{ fill: "#1976d2" }} /></MenuItem>
                                <MenuItem value="#9c27b0" ><CircleIcon sx={{ fill: "#9c27b0" }} /></MenuItem>
                                <MenuItem value="#2e7d32" ><CircleIcon sx={{ fill: "#2e7d32" }} /></MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
            </Box>
        </Layout>
    );
}

export default Home;
