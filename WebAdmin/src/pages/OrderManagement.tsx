import { useState, useEffect, Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"
import Swal from "sweetalert2"
import { useDispatch } from "react-redux"
import { setPageTitle } from "../store/themeConfigSlice"
import { useOrders } from "../controller/OrderController"
import { OrderModel } from "../model/OrderModel"

const OrderManagement = () => {
    const { getOrders, deleteOrder, updateOrder } = useOrders()
    const [orders, setOrders] = useState<OrderModel[]>([])
    const [editModal, setEditModal] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState<OrderModel | null>(null)
    const [newStatus, setNewStatus] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle("Quản Lý Đơn Hàng"))
        fetchAllOrders()
    }, [dispatch])

    const fetchAllOrders = async () => {
        setIsLoading(true)
        try {
            const response = await getOrders()
            if (Array.isArray(response)) {
                setOrders(response)
            } else {
                console.error("Dữ liệu trả về không phải là mảng:", response)
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu đơn hàng", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteOrder = async (id: string) => {
        const result = await Swal.fire({
            title: "Bạn có chắc chắn muốn xóa đơn hàng này không?",
            text: "Hành động này không thể hoàn tác!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
        })

        if (result.isConfirmed) {
            try {
                await deleteOrder(id)
                Swal.fire("Đơn hàng đã được xóa!", "", "success")
                fetchAllOrders()
            } catch (error) {
                console.error("Error deleting order:", error)
                Swal.fire("Không thể xóa đơn hàng!", "Vui lòng thử lại sau.", "error")
            }
        }
    }

    const handleEditOrder = (order: OrderModel) => {
        setSelectedOrder(order)
        setNewStatus(order.status)
        setEditModal(true)
    }

    const handlePayment = (payUrl?: string) => {
        if (payUrl) {
            window.location.href = payUrl // Chuyển hướng đến đường link thanh toán MOMO
        } else {
            alert("Link thanh toán không khả dụng!")
        }
    }

    // const handleUpdateOrderStatus = async () => {
    //     if (selectedOrder) {
    //         try {
    //             const updatedOrder = { ...selectedOrder, status: newStatus }
    //             await updateOrder(selectedOrder._id, updatedOrder)
    //             Swal.fire("Cập nhật trạng thái thành công!", "", "success")
    //             fetchAllOrders()
    //             setEditModal(false)
    //         } catch (error) {
    //             console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error)
    //             Swal.fire("Không thể cập nhật trạng thái!", "Vui lòng thử lại sau.", "error")
    //         }
    //     }
    // }

    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl">Quản Lý Đơn Hàng</h2>
            </div>

            <div className="mt-5 panel p-0 border-0 overflow-hidden">
                <div className="table-responsive">
                    {isLoading ? (
                        <p>Đang tải đơn hàng...</p>
                    ) : (
                        <table className="table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>Mã Đơn Hàng</th>
                                    <th>Tên Khách Hàng</th>
                                    <th>Sản Phẩm</th>
                                    <th>Ngày Đặt Hàng</th>
                                    <th>Tổng Tiền</th>
                                    <th>Trạng Thái Thanh Toán</th>
                                    <th>Trạng Thái Giao Hàng</th>
                                    <th className="!text-center">Hoạt Động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id}>
                                        <td>{order._id}</td>
                                        <td>{order.userId?.name || "Đang tải..."}</td>

                                        {/* Hiển thị tên sản phẩm */}
                                        <td>
                                            {order.products.map((product: any) => (
                                                <p key={product._id}>{product.productId.name}</p>
                                            ))}
                                        </td>

                                        <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                        <td>{order.totalAmount}</td>
                                        <td>{order.paymentStatus}</td>
                                        <td>{order.deliveryStatus}</td>
                                        <td>
                                            <div className="flex gap-4 items-center justify-center">
                                                <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteOrder(order._id)}>
                                                    Xóa
                                                </button>
                                                <button type="button" className="btn btn-sm btn-outline-success" onClick={() => handleEditOrder(order)}>
                                                    Cập nhật trạng thái
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-warning"
                                                    onClick={() => handlePayment(order.payUrl)} // Truyền `payUrl` vào hàm
                                                >
                                                    Thanh toán ngay
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            <Transition appear show={editModal} as={Fragment}>
                <Dialog as="div" open={editModal} onClose={() => setEditModal(false)} className="relative z-[51]">
                    <div className="fixed inset-0 bg-black/60" />
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-full">
                            <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                                <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] px-5 py-3">Cập Nhật Trạng Thái Đơn Hàng</div>
                                <div className="p-5">
                                    <form>
                                        <div className="mb-5">
                                            <label htmlFor="status">Trạng Thái Đơn Hàng</label>
                                            <input id="status" type="text" placeholder="Nhập trạng thái mới" className="form-input" value={newStatus} onChange={(e) => setNewStatus(e.target.value)} />
                                        </div>
                                        <div className="flex justify-end items-center mt-8">
                                            <button type="button" className="btn btn-outline-danger" onClick={() => setEditModal(false)}>
                                                Hủy
                                            </button>
                                            <button type="button" className="btn btn-outline-success">
                                                Cập nhật
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    )
}

export default OrderManagement
