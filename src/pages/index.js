import React, { useEffect } from "react";
import {
    Routes,
    Route,
    useLocation,
    Navigate
} from "react-router-dom";
import {
    shallowEqual,
    useSelector,
    useDispatch
} from "react-redux";
import { authSelector, setUser } from "state/auth";
import Dashboard from "pages/dashboard/dashboard";
import Income from "pages/income/income";
import Expense from "pages/expense/expense";
import Fields from "pages/fields/fields";
import Settings from "pages/settings/settings";
import Login from "pages/login/login";
import { auth, addUser, getUser, updateUser } from "services/firebase";
import Logo from "assets/logo.jpg";
import { toast } from "react-toastify";


function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

function Pages() {
    const dispatch = useDispatch();
    const { user } = useSelector(authSelector, shallowEqual);


    useEffect(() => {
        auth.onAuthStateChanged(async (user) => {
            try {
                if (user) {
                    const userData = await getUser(user.uid);
                    if (userData) {
                        await updateUser(user.uid, {
                            lastLoggedIn: user.metadata.lastSignInTime,
                        });
                        dispatch(setUser(userData));
                    } else {
                        const newUserData = {
                            uid: user.uid,
                            photoURL: user.photoURL || Logo,
                            displayName: user.displayName || "Anonymous",
                            email: user.email || "anonymous@email.com",
                            created: user.metadata.creationTime,
                            lastLoggedIn: user.metadata.lastSignInTime,
                        };
                        await addUser(user.uid, newUserData);
                        dispatch(setUser(newUserData));
                    }

                } else {
                    dispatch(setUser(null))
                    localStorage.clear();
                }
            } catch (error) {
                toast.error(error.message);
                dispatch(setUser(null))
                localStorage.clear();
            }
        });
    }, []);



    return (
        <>
            <ScrollToTop />
            <Routes>
                <Route exact path="/" element={user ? <Dashboard /> : <Login />} />
                <Route exact path="/income" element={user ? <Income /> : <Login />} />
                <Route exact path="/expenses" element={user ? <Expense /> : <Login />} />
                <Route exact path="/fields" element={user ? <Fields /> : <Login />} />
                <Route exact path="/settings" element={user ? <Settings /> : <Login />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );
}

export default Pages;

