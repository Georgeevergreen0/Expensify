import { useQuery } from 'react-query';

import {
    getAllTransactions,
    getAllIncome,
    getAllExpense,
    getAllField,
    getAllUser,
    getAllowedUsers,
} from "services/firebase"




export const useGetAllTransactionsQuery = (user) => {
    return useQuery("getAllTransactionsQuery", () => getAllTransactions(user));
};

export const useGetAllIncomeQuery = (user) => {
    return useQuery("getAllIncomeQuery", () => getAllIncome(user));
};

export const useGetAllExpenseQuery = (user) => {
    return useQuery("getAllExpenseQuery", () => getAllExpense(user));
};

export const useGetAllFieldQuery = () => {
    return useQuery("getAllFieldQuery", () => getAllField());
};

export const useGetAllUserQuery = () => {
    return useQuery("getAllUserQuery", () => getAllUser());
};

export const useGetAllowedUsersQuery = () => {
    return useQuery("getAllowedUsers", () => getAllowedUsers());
};
