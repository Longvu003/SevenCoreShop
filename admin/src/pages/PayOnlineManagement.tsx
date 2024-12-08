import { useEffect, useState } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../store/themeConfigSlice';
import { PayOnline } from '../model/PayOnlineModel';
import { payOnlineController } from '../controller/PayOnlineController';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const PayOnlineManagement = () => {
    const { getPayOnlineList, deletePayOnlineById } = payOnlineController();
    const [dataPayOnline, setDataPayOnline] = useState<PayOnline[]>([]);

    const handleDelete = async (id: string) => {
        MySwal.fire({
            title: 'Bạn có chắc chắn muốn xóa?',
            text: 'Bạn sẽ không thể hoàn tác hành động này!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa!',
            cancelButtonText: 'Hủy'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response: any = await deletePayOnlineById(id);
                console.log("Deleted value: " + response);
                if (response.status === true) {
                    const data: any = await getPayOnlineList();
                    console.log(data);
                    setDataPayOnline(data.data);
                    await MySwal.fire(
                        'Đã xóa!',
                        'Mục thanh toán đã được xóa.',
                        'success'
                    );
                } else {
                    await MySwal.fire(
                        'Lỗi!',
                        'Xóa mục thanh toán thất bại.',
                        'error'
                    );
                }
            }
        });
    };

    const showData = async () => {
        const data: any = await getPayOnlineList();
        console.log(data.data);
        setDataPayOnline(data.data);
    };

    useEffect(() => {
        showData();
    }, []);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Pay Online Management'));
    });

    return (
        <div className="grid xl:grid-cols-1 gap-12 grid-cols-1">
            <div className="panel">
                <div className="flex items-center justify-between mb-12">
                    <h5 className="font-semibold text-lg dark:text-white-light">Quản lý thanh toán trực tuyến</h5>
                    <a href="/payonline/new" className="btn btn-success">+ Thêm mục thanh toán</a>
                </div>
                <div className="table-responsive mb-5">
                    <table>
                        <thead>
                            <tr>
                                <th>Ngân hàng</th>
                                <th>Chủ tài khoản</th>
                                <th>Số tài khoản</th>
                                <th>Hình ảnh</th>
                                <th className="text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataPayOnline.map((payOnline) => (
                                <tr key={payOnline._id}>
                                    <td>{payOnline.bank}</td>
                                    <td>{payOnline.acc_holder}</td>
                                    <td>{payOnline.acc_number}</td>
                                    <td>
                                        {Array.isArray(payOnline.images) && payOnline.images.length > 0 ? (
                                            <img
                                                src={payOnline.images[0]}
                                                alt={payOnline.bank}
                                                style={{ width: '50px', height: '60px', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <span>Không có ảnh</span>
                                        )}
                                    </td>
                                    <td>
                                        <div className="flex gap-4 items-center justify-center">
                                            <a href={`/payonline/edit?id=${payOnline._id}`} className="btn btn-sm btn-outline-primary">
                                                Chỉnh sửa
                                            </a>
                                            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(payOnline._id)}>
                                                Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PayOnlineManagement;