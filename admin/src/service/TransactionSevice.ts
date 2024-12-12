import { Transaction } from '../model/TransactionsModel';
const API_URL = 'http://localhost:7777';

export const GetTransactions = async (): Promise<Transaction[]> => {
    try {
        const response = await fetch(`${API_URL}/cron/all`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const responseData = await response.json();
        console.log("Fetched Transactions:", responseData);

        if (!response.ok) {
            throw new Error(responseData?.message || "Failed to fetch transactions");
        }

        return responseData as Transaction[];
    } catch (error) {
        console.error("Error fetching transactions:", error);
        throw error;
    }
};