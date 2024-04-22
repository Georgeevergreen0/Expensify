export const numberFormat = (value, fraction = 2) => {
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: fraction,
        maximumFractionDigits: fraction
    }).format(value);
}