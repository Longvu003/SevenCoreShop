import { GetTransactions } from '../service/TransactionSevice';

export const transactionController = () => {

    const getTransactions = async () => {
        try {
            const transactions = await GetTransactions();
            return transactions;
        } catch (error) {
            console.error('Failed to get transactions', error);
            return error;
        }
    };

    return {
        getTransactions
    };
};