import React from "react"
import FormControl, { FormControlProps } from '@mui/material/FormControl';
import OutlinedInput, { OutlinedInputProps } from '@mui/material/OutlinedInput';
import Adornment, { InputAdornmentProps } from '@mui/material/InputAdornment';
import css from "./input.module.scss";
import cx from "classnames";


const Input = (props: FormControlProps & OutlinedInputProps & { EndAdornment?: React.FunctionComponent<InputAdornmentProps> }) => {
    const { className, fullWidth, ...otherProps } = props;

    return (
        <FormControl hiddenLabel className={cx(css.inputContainer, className)} fullWidth={fullWidth} >
            <OutlinedInput
                fullWidth={fullWidth}
                className={css.input}
                classes={{

                    adornedEnd: css.adornedEnd,
                    inputAdornedEnd: css.inputAdornedEnd

                }}
                {...otherProps}
            />
        </FormControl >
    )
}

export const EndAdornment = (props: InputAdornmentProps) => {
    const { className, ...otherProps } = props;
    return (
        <Adornment className={cx(css.adorned, className)}  {...otherProps} />
    )
}

EndAdornment.defaultProps = {
    position: "end"
};

Input.EndAdornment = EndAdornment

export default Input;
