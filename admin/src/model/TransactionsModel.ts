export interface Transaction {
    _id: string;
    refNo: string;
    tranId: string;
    postingDate: Date;
    transactionDate: Date;
    accountNo: string;
    creditAmount: number;
    debitAmount: number;
    currency: string;
    description: string;
    availableBalance: number;
    beneficiaryAccount: string;
}