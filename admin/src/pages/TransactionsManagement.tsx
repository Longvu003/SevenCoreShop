import { useEffect, useState } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../store/themeConfigSlice';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Transaction } from '../model/TransactionsModel';
import { transactionController } from '../controller/TransactionsController';

const MySwal = withReactContent(Swal);

const TransactionsManagement = () => {
    const { getTransactions } = transactionController();
    const [dataTransactions, setDataTransactions] = useState<Transaction[]>([]);

    const showData = async () => {
        try {
            const data: any = await getTransactions();
            console.log("Transactions:", data);
            // Sắp xếp giao dịch theo ngày giảm dần
            const sortedData = data.sort(
                (a: Transaction, b: Transaction) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
            );
            setDataTransactions(sortedData || []);
        } catch (error) {
            console.error("Error fetching transactions:", error);
            setDataTransactions([]);
        }
    };
    

    useEffect(() => {
        showData();
    }, []);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Transactions Management'));
    }, [dispatch]);

    return (
        <div className="grid xl:grid-cols-1 gap-12 grid-cols-1">
            <div className="panel">
                <div className="flex items-center justify-between mb-12">
                    <h5 className="font-semibold text-lg dark:text-white-light">Quản lý hóa đơn trực tuyến</h5>
                </div>
                <div className="table-responsive mb-5">
                    <table>
                        <thead>
                            <tr>
                                <th>Ngày chuyển tiền</th>
                                <th>Số tài khoản</th>
                                <th>Tiền chuyển đến</th>
                                <th className="text-center">Nội dung chuyển tiền</th>
                            </tr>
                        </thead>
                        <tbody>
    {dataTransactions.length > 0 ? (
        dataTransactions.map((transaction, index) => (
            <tr key={index}>
                <td>{new Date(transaction.transactionDate).toLocaleString()}</td>
                <td>{transaction.accountNo}</td>
                <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(transaction.creditAmount)}</td>
                <td className="text-center">{transaction.description}</td>
            </tr>
        ))
    ) : (
        <tr>
            <td colSpan={5} className="text-center">
                Không có giao dịch nào
            </td>
        </tr>
    )}
</tbody>

                    </table>
                </div>
            </div>
        </div>
    );
};

export default TransactionsManagement;