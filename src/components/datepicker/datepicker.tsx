import React from "react";
import ReactDatepicker from "react-datepicker";
import { format } from 'date-fns';
import { Input } from "components";
import css from "./datepicker.module.scss";



const DatePickerInput = React.forwardRef((props: any, ref) => {
    const { placeholder, error, value, onClick, onChange, disabled, className } = props;
    return (
        <Input
            inputRef={ref}
            fullWidth
            readOnly
            placeholder={placeholder}
            error={error}
            value={value}
            onClick={onClick}
            onChange={onChange}
            disabled={disabled}
            className={className}
            endAdornment={
                <Input.EndAdornment>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path stroke="none" fillRule="evenodd" clipRule="evenodd" d="M17 2C17 1.44772 16.5523 1 16 1C15.4477 1 15 1.44772 15 2V3H9V2C9 1.44772 8.55228 1 8 1C7.44772 1 7 1.44772 7 2V3H5C3.34315 3 2 4.34315 2 6V10V20C2 21.6569 3.34315 23 5 23H19C20.6569 23 22 21.6569 22 20V10V6C22 4.34315 20.6569 3 19 3H17V2ZM20 9V6C20 5.44772 19.5523 5 19 5H17V6C17 6.55228 16.5523 7 16 7C15.4477 7 15 6.55228 15 6V5H9V6C9 6.55228 8.55228 7 8 7C7.44772 7 7 6.55228 7 6V5H5C4.44772 5 4 5.44772 4 6V9H20ZM4 11H20V20C20 20.5523 19.5523 21 19 21H5C4.44772 21 4 20.5523 4 20V11ZM6 14C6 13.4477 6.44772 13 7 13L17 13C17.5523 13 18 13.4477 18 14C18 14.5523 17.5523 15 17 15L7 15C6.44772 15 6 14.5523 6 14ZM7 17C6.44772 17 6 17.4477 6 18C6 18.5523 6.44772 19 7 19H12C12.5523 19 13 18.5523 13 18C13 17.4477 12.5523 17 12 17H7Z" />
                    </svg>
                </Input.EndAdornment>
            }
        />
    )
});


const Datepicker = (props) => {
    const { placeholder, error, ...otherprops } = props;

    return (
        <ReactDatepicker
            portalId="root"
            showPopperArrow={false}
            calendarStartDay={1}
            renderCustomHeader={({
                date,
                decreaseMonth,
                increaseMonth,
                decreaseYear,
                increaseYear,
                prevMonthButtonDisabled,
                nextMonthButtonDisabled,
                prevYearButtonDisabled,
                nextYearButtonDisabled,
            }) => (
                <div className={css.headerContainer}>

                    <button className={css.buttonLeftYear} onClick={decreaseYear} disabled={prevYearButtonDisabled}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.59 18 19 16.59 14.42 12 19 7.41 17.59 6l-6 6z"></path><path d="m11 18 1.41-1.41L7.83 12l4.58-4.59L11 6l-6 6z"></path></svg>
                    </button>

                    <button className={css.buttonLeftMonth} onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ><path fill="none" d="M0 0h24v24H0z" /><path d="M8 12l6-6v12z" /></svg>
                    </button>


                    <span className={css.dateTitle}>{format(date, "MMM yyyy")}</span>


                    <button className={css.buttonRightMonth} onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ><path fill="none" d="M0 0h24v24H0z" /><path d="M16 12l-6 6V6z" /></svg>
                    </button>

                    <button className={css.buttonRightYear} onClick={increaseYear} disabled={nextYearButtonDisabled}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ><path d="M6.41 6 5 7.41 9.58 12 5 16.59 6.41 18l6-6z"></path><path d="m13 6-1.41 1.41L16.17 12l-4.58 4.59L13 18l6-6z"></path></svg>
                    </button>

                </div>
            )
            }
            popperClassName="BM-datepicker"
            customInput={<DatePickerInput error={error} />}
            placeholderText={placeholder}
            popperPlacement="bottom"
            dateFormat="dd/MM/yyyy"
            {...otherprops}
        />
    )
}


export default Datepicker;
