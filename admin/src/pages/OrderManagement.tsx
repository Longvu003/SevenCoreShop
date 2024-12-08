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

    // const showData = async () => {
    //     try {
    //         const data: any = await getOrder();
    //         console.log(" Orders:", data); // Log dữ liệu trả về từ API
    //         setDataOrder(data.data || []); // Đảm bảo data.data luôn là một mảng
    //     } catch (error) {
    //         console.error("Error fetching orders:", error);
    //         setDataOrder([]); // Đặt dataOrder là mảng rỗng nếu có lỗi
    //     }
    // };

    const showData = async () => {
        try {
            const data: any = await getOrder();
            console.log("Orders:", data); // In ra dữ liệu từ API
            setDataOrder(data || []); // Đảm bảo `data` là một mảng
        } catch (error) {
            console.error("Error fetching orders:", error);
            setDataOrder([]); // Đặt giá trị mặc định là mảng rỗng nếu có lỗi
        }
    };


    useEffect(() => {
        showData();
    }, []);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Tables'));
    });



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
                                <th>Ngày mua</th>
                                <th className="text-center">Trạng thái</th>
                                <th className="text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataOrder?.length > 0 ? (
                                dataOrder.map((order, index) => (
                                    <tr key={index}>
                                        <td>{order._id}</td>
                                        <td>{order.totalAmount}</td>
                                        <td>{order.address}</td>
                                        <td>{format(new Date(order.date), 'HH:mm - dd/MM/yyyy')}</td>
                                        {/* <td
                                            className={`text-center whitespace-nowrap ${order.status === 'Delivered'
                                                ? 'text-success'
                                                : order.status === 'Pending'
                                                    ? 'text-warning'
                                                    : 'text-danger'
                                                }`}
                                        >
                                            {order.status === 'Delivered'
                                                ? 'Đã giao hàng'
                                                : order.status === 'Pending'
                                                    ? 'Đang xử lý'
                                                    : 'Đã hủy'}
                                        </td> */}

                                        {/* <td className="text-center whitespace-nowrap">
                                            <div x-data="dropdown" className="dropdown relative inline-block text-left">
                                                <button
                                                    type="button"
                                                    className={`btn dropdown-toggle btn-dark ${order.status === "Delivered"
                                                            ? "bg-success text-white"
                                                            : order.status === "Pending"
                                                                ? "bg-warning text-dark"
                                                                : "bg-danger text-white"
                                                        }`}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        const currentDropdown = e.currentTarget.nextSibling;
                                                        if (currentDropdown) {
                                                            currentDropdown.classList.toggle("hidden");
                                                        }
                                                    }}
                                                >
                                                    {order.status === "Delivered"
                                                        ? "Đã giao hàng"
                                                        : order.status === "Pending"
                                                            ? "Đang xử lý"
                                                            : "Đã hủy"}
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        width="16"
                                                        height="16"
                                                        fill="currentColor"
                                                        className="ml-2"
                                                    >
                                                        <path d="M12 15l-4-4h8z" />
                                                    </svg>
                                                </button>
                                                <ul
                                                    className="dropdown-menu absolute z-50 bg-white border border-gray-300 rounded shadow-md hidden"
                                                >
                                                    <li>
                                                        <button
                                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                                            onClick={() => {
                                                                console.log(`Thay đổi trạng thái đơn hàng ${order._id} thành Delivered`);
                                                            }}
                                                        >
                                                            Đã giao hàng
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button
                                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                                            onClick={() => {
                                                                console.log(`Thay đổi trạng thái đơn hàng ${order._id} thành Pending`);
                                                                // Thực hiện logic thay đổi trạng thái
                                                            }}
                                                        >
                                                            Đang xử lý
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button
                                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                                            onClick={() => {
                                                                console.log(`Thay đổi trạng thái đơn hàng ${order._id} thành Canceled`);
                                                                // Thực hiện logic thay đổi trạng thái
                                                            }}
                                                        >
                                                            Đã hủy
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </td> */}

<td className="text-center whitespace-nowrap">
    <div className="dropdown relative inline-block text-left">
        {/* Nút Dropdown */}
        <button
            type="button"
            className={`btn dropdown-toggle btn-dark ${
                order.status === "Delivered"
                    ? "bg-success text-white"
                    : order.status === "Pending"
                    ? "bg-warning text-dark"
                    : "bg-danger text-white"
            }`}
            onClick={(e) => {
                e.preventDefault();
                const currentDropdown = e.currentTarget.nextSibling;
                currentDropdown.classList.toggle("hidden");
            }}
        >
            {order.status === "Delivered"
                ? "Đã giao hàng"
                : order.status === "Pending"
                ? "Đang xử lý"
                : "Đã hủy"}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
                className="ml-2"
            >
                <path d="M12 15l-4-4h8z" />
            </svg>
        </button>

        {/* Menu Dropdown */}
        <ul className="dropdown-menu absolute z-50 bg-white border border-gray-300 rounded shadow-md hidden">
            {["Delivered", "Pending", "Canceled"].map((status) => (
                <li key={status}>
                    <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={async () => {
                            try {
                                await updateOrderStatus(order._id, status);
                                showData(); // Làm mới danh sách đơn hàng
                                MySwal.fire({
                                    title: "Thành công",
                                    text: `Trạng thái đơn hàng đã được cập nhật thành ${status}`,
                                    icon: "success",
                                    confirmButtonText: "OK",
                                });
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
                        {status === "Delivered"
                            ? "Đã giao hàng"
                            : status === "Pending"
                            ? "Đang xử lý"
                            : "Đã hủy"}
                    </button>
                </li>
            ))}
        </ul>
    </div>
</td>


                                        <td>
                                            <div className="flex gap-4 items-center justify-center">
                                                <a className="btn btn-sm btn-outline-primary">
                                                    Chi tiết
                                                </a>
                                                <button type="button" className="btn btn-sm btn-outline-danger">
                                                    Xóa
                                                </button>
                                            </div>
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
