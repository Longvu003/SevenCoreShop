import { useEffect, useState } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '../store/themeConfigSlice';
import Swal from "sweetalert2";
import { Order } from '../model/OrderModel';
import { orderController } from '../controller/OrderController';
import withReactContent from 'sweetalert2-react-content';
import { format } from 'date-fns';
import IconTrash from '../components/Icon/IconTrash';

const Tables = () => {
    const { getOrder, updateOrderStatus } = orderController();
    const [dataOrder, setDataOrder] = useState<Order[]>([]);
    const MySwal = withReactContent(Swal);

    const showData = async () => {
        try {
            const data: any = await getOrder();
            console.log("Orders:", data);
            setDataOrder(data || []);
        } catch (error) {
            console.error("Error fetching orders:", error);
            setDataOrder([]);
        }
    };

    useEffect(() => {
        showData();
    }, []);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Tables'));
    }, [dispatch]);

    return (
        <div className="grid xl:grid-cols-1 gap-12 grid-cols-1">
            <div className="panel">
                <div className="flex items-center justify-between mb-12">
                    <h5 className="font-semibold text-lg dark:text-white-light">Quản lý đơn hàng</h5>
                </div>
                <div className="table-responsive">
                    <table className="table-hover">
                        <thead>
                            <tr>
                                <th>Mã đơn hàng</th>
                                <th>Tổng tiền</th>
                                <th>Địa chỉ</th>
                                <th>Mã chuyển tiền</th>
                                <th>Trạng thái thanh toán</th>
                                <th>Ngày mua</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataOrder?.length > 0 ? (
                                dataOrder.map((order, index) => (
                                    <tr key={index}>
                                        <td>{order._id}</td>
                                        <td>{order.totalAmount}</td>
                                        <td>{order.address}</td>
                                        <td>{order.orderCode}</td>
                                        <td className="text-center whitespace-nowrap">
                                            <select
                                                className={`btn dropdown-toggle btn-dark ${order.statuspay === "Success"
                                                        ? "bg-success text-white"
                                                        : order.statuspay === "Delivered"
                                                            ? "bg-primary text-white"
                                                            : order.statuspay === "Pending"
                                                                ? "bg-warning text-dark"
                                                                : order.statuspay === "Canceled"
                                                                    ? "bg-danger text-white"
                                                                    : ""
                                                    }`}
                                                value={order.statuspay}
                                                onChange={async (e) => {
                                                    const newStatus = e.target.value;
                                                    alert("cập nhật trạng thái");
                                                    // try {
                                                    //     const res = await updateOrderStatus(order._id, newStatus);
                                                    //     console.log(res);
                                                    //     if (res) {
                                                    //         showData();
                                                    //         MySwal.fire({
                                                    //             title: "Thành công",
                                                    //             text: `Trạng thái đơn hàng đã được cập nhật thành ${newStatus}`,
                                                    //             icon: "success",
                                                    //             confirmButtonText: "OK",
                                                    //         });
                                                    //     }
                                                    // } catch (error) {
                                                    //     console.error("Cập nhật trạng thái thất bại:", error);
                                                    //     MySwal.fire({
                                                    //         title: "Thất bại",
                                                    //         text: "Không thể cập nhật trạng thái đơn hàng",
                                                    //         icon: "error",
                                                    //         confirmButtonText: "OK",
                                                    //     });
                                                    // }
                                                }}
                                            >
                                                <option value="Completed">Đã Thanh Toán</option>
                                                <option value="Pending">Đang xử lý</option>
                                            </select>
                                        </td>                                        <td>{format(new Date(order.date), 'HH:mm - dd/MM/yyyy')}</td>
                                        <td className="text-center whitespace-nowrap">
                                            <select
                                                className={`btn dropdown-toggle btn-dark ${order.status === "Success"
                                                        ? "bg-success text-white"
                                                        : order.status === "Delivered"
                                                            ? "bg-primary text-white"
                                                            : order.status === "Pending"
                                                                ? "bg-warning text-dark"
                                                                : order.status === "Canceled"
                                                                    ? "bg-danger text-white"
                                                                    : ""
                                                    }`}
                                                value={order.status}
                                                onChange={async (e) => {
                                                    const newStatus = e.target.value;
                                                    try {
                                                        const res = await updateOrderStatus(order._id, newStatus);
                                                        console.log(res);
                                                        if (res) {
                                                            showData();
                                                            MySwal.fire({
                                                                title: "Thành công",
                                                                text: `Trạng thái đơn hàng đã được cập nhật thành ${newStatus}`,
                                                                icon: "success",
                                                                confirmButtonText: "OK",
                                                            });
                                                        }
                                                    } catch (error) {
                                                        console.error("Cập nhật trạng thái thất bại:", error);
                                                        MySwal.fire({
                                                            title: "Thất bại",
                                                            text: "Không thể cập nhật trạng thái đơn hàng",
                                                            icon: "error",
                                                            confirmButtonText: "OK",
                                                        });
                                                    }
                                                }}
                                            >
                                                <option value="Delivered">Đã giao hàng</option>
                                                <option value="Success">Giao thành công</option>
                                                <option value="Pending">Đang xử lý</option>
                                                <option value="Canceled">Đã hủy</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center">
                                        Không có đơn hàng nào
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

export default Tables;

