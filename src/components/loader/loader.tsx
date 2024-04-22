import React from "react";
import { Box, CircularProgress } from "components"
import css from "./loader.module.scss";





const Loader = (props) => {
    return (
        <Box className={css.loader}>
            <CircularProgress {...props} />
        </Box>
    )
}


export default Loader;
