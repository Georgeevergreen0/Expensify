import * as React from 'react';
import { default as MUIDialog, DialogProps } from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import cx from "classnames";
import css from "./dialog.module.scss";

interface BMDialogProps extends DialogProps {
    closeIconClassName?: string;
}

const Dialog = (props: BMDialogProps) => {
    const { children, open, onClose, closeIconClassName, ...otherProps } = props;
    return (
        <MUIDialog
            fullWidth
            maxWidth="md"
            open={open}
            onClose={onClose}
            {...otherProps}
        >
            {onClose && (
                <IconButton className={cx(css.closeIcon, closeIconClassName)} onClick={(event) => onClose(event, "backdropClick")}>
                    <HighlightOffIcon color="primary" />
                </IconButton>
            )}
            {children}
        </MUIDialog>
    );
}

export default Dialog;

