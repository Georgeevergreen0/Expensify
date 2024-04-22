import React, { useState } from "react";
import { styled } from '@mui/material/styles';
import { Drawer, Box, Divider, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Button, Typography, AppBar, Toolbar, IconButton, Avatar } from "components";
import MenuIcon from '@mui/icons-material/Menu';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SettingsIcon from '@mui/icons-material/Settings';
import BalconyIcon from '@mui/icons-material/Balcony';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { logout } from "services/firebase";
import {
    shallowEqual,
    useSelector
} from "react-redux";
import { authSelector } from "state/auth";
import Logo from "assets/logo.jpg";
import css from "./layout.module.scss";
import { useNavigate, useLocation } from "react-router-dom";

const DrawerHeaderReset = styled('div')(({ theme }) => ({
    ...theme.mixins.toolbar
}));

function Layout(props) {
    const { children } = props;
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useSelector(authSelector, shallowEqual);
    const [isOpen, setIsOpen] = useState(false);

    const toggleDrawer = (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }

        setIsOpen(isOpen => !isOpen);
    };

    const navigateTo = (path: string) => {
        setIsOpen(open => !open);
        navigate(path);
    }

    const handleLogout = () => {
        logout();
        setIsOpen(open => !open);
    }

    return (
        <React.Fragment>
            <Drawer variant="temporary" anchor="left" open={isOpen} onClose={toggleDrawer} className={css.drawer} classes={{ paper: css.drawer }} closeAfterTransition>
                <Box className={css.draweImageContainer}>
                    <img src={Logo} alt="Expensify" />
                </Box>
                <Divider />
                <List className={css.list}>
                    <ListItem disablePadding divider>
                        <ListItemButton selected={location.pathname === "/"} onClick={() => navigateTo("/")}>
                            <ListItemIcon>
                                <AccountBalanceIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding divider>
                        <ListItemButton selected={location.pathname === "/income"} onClick={() => navigateTo("/income")}>
                            <ListItemIcon>
                                <AttachMoneyIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText primary="Income" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding divider>
                        <ListItemButton selected={location.pathname === "/expenses"} onClick={() => navigateTo("/expenses")}>
                            <ListItemIcon>
                                <MoneyOffIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText primary="Expenses" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding divider>
                        <ListItemButton selected={location.pathname === "/fields"} onClick={() => navigateTo("/fields")}>
                            <ListItemIcon>
                                <BalconyIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText primary="Fields" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding divider>
                        <ListItemButton selected={location.pathname === "/settings"} onClick={() => navigateTo("/settings")}>
                            <ListItemIcon>
                                <SettingsIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText primary="Settings" />
                        </ListItemButton>
                    </ListItem>

                </List>

                <Button variant="contained" className={css.logout} color="primary" onClick={handleLogout}>
                    <PowerSettingsNewIcon className={css.logoutIcon} />
                    <Typography variant="button">Log Out</Typography>
                </Button>

            </Drawer>

            <Box className={css.body}>
                <AppBar position="fixed" color="primary">
                    <Toolbar className={css.header}>
                        <IconButton color="inherit" onClick={toggleDrawer} >
                            <MenuIcon />
                        </IconButton>

                        <Typography variant="h6" noWrap className={css.name}>{user.displayName}</Typography>
                        <Avatar src={user.photoURL} className={css.avatar} />
                    </Toolbar>
                </AppBar>
                <DrawerHeaderReset />
                <Box className={css.children}>
                    <>{children}</>
                </Box>
            </Box>
        </React.Fragment>
    );
}

export default Layout;