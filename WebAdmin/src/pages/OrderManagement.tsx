import { useState, Fragment, useEffect } from "react"
import { Dialog, Transition } from "@headlessui/react"
import Swal from "sweetalert2"
import { useDispatch } from "react-redux"
import { setPageTitle } from "../store/themeConfigSlice"
import { useOrderController } from "../controller/OrderController"
import { OrderModel } from "../model/OrderModel"
import { useNavigate } from "react-router-dom"

const OrderManagement = () => {
    const { fetchAllOrders, deleteOrderById, updateOrderById, markOrderAsPaid } = useOrderController()
    const [dataOrders, setDataOrders] = useState<OrderModel[]>([])
    const [editModal, setEditModal] = useState(false)
    const [params, setParams] = useState<OrderModel>({
        _id: "",
        ID_User: "",
        Total: 0,
        Products: [],
        Status: "",
        CreatedAt: "",
    })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    // Fetch and show all orders
    const showData = async () => {
        try {
            setLoading(true)
            const data = await fetchAllOrders() as { data: OrderModel[] }
            setDataOrders(data.data)
        } catch (error) {
            showMessage("Lỗi khi tải đơn hàng", "error")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        showData()
    }, [])

    // Show message with SweetAlert2
    const showMessage = (msg = "", type: "success" | "error" | "warning" | "info" = "success") => {
        Swal.fire({
            toast: true,
            position: "top",
            icon: type,
            title: msg,
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: "toast" },
            padding: "10px 20px",
        })
    }

    // Handle delete order
    const deleteOrder = async (id: string) => {
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
                const deleteResult = await deleteOrderById(id) as { status: boolean }
                if (deleteResult.status) {
                    showMessage("Xóa Thành Công", "success")
                    showData() // Update the list after delete
                } else {
                    showMessage("Xóa Thất Bại", "error")
                }
            } catch (error) {
                showMessage("Lỗi khi xóa đơn hàng", "error")
            }
        }
    }

    const paymentOrder = async (id: string) => {
        const result = await Swal.fire({
            title: 'Bạn có chắc chắn muốn thanh toán đơn hàng này không?',
            text: "Hành động này không thể hoàn tác!",
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Thanh toán ngay',
            cancelButtonText: 'Hủy'
        });
    
        if (result.isConfirmed) {
            try {
                setLoading(true);
                const paymentResult = await markOrderAsPaid(id) as { status: boolean, payUrl?: string };
                
                if (paymentResult.status && paymentResult.payUrl) {
                    showMessage('Thanh Toán Thành Công', 'success');
                    
                    // Chuyển hướng người dùng đến payUrl mà Momo trả về
                    navigate(paymentResult.payUrl);
                } else {
                    showMessage('Thanh Toán Thất Bại', 'error');
                }
            } catch (error) {
                showMessage('Lỗi khi thanh toán', 'error');
            } finally {
                setLoading(false);
            }
        }
    };
    
    

    // Handle editing order
    const editOrder = (order: OrderModel) => {
        setParams(order) // Set data to edit
        setEditModal(true) // Open the edit modal
    }

    // Handle order update
    const handleUpdateOrder = async () => {
        if (!params.ID_User || !params.Status) {
            showMessage("User ID và Trạng Thái không được để trống", "error")
            return
        }

        try {
            setLoading(true)
            const result = await updateOrderById(params._id, params) as { status: boolean, message?: string }
            if (result.status) {
                showMessage("Cập Nhật Thành Công", "success")
                setEditModal(false)
                showData() // Update the list after update
            } else {
                showMessage(result.message || "Cập Nhật Thất Bại", "error")
            }
        } catch (error) {
            showMessage("Lỗi khi cập nhật đơn hàng", "error")
        } finally {
            setLoading(false)
        }
    }

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target
        setParams({ ...params, [id]: value })
    }

    useEffect(() => {
        dispatch(setPageTitle("Quản Lý Đơn Hàng"))
    }, [dispatch])

    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl">Quản Lý Đơn Hàng</h2>
            </div>
            <div className="mt-5 panel p-0 border-0 overflow-hidden">
                <div className="table-responsive">
                    <table className="table-striped table-hover">
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>Total</th>
                                <th>Products</th>
                                <th>Status</th>
                                <th>Created At</th>
                                <th className="!text-center">Hoạt Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataOrders.map((order) => (
                                <tr key={order._id}>
                                    <td>{order.ID_User}</td>
                                    <td>{order.Total}</td>
                                    <td>{order.Products.join(", ")}</td>
                                    <td>{order.Status}</td>
                                    <td>{order.CreatedAt}</td>
                                    <td>
                                        <div className="flex gap-4 items-center justify-center">
                                            <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => editOrder(order)}>
                                                Chỉnh Sửa
                                            </button>
                                            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => deleteOrder(order._id)}>
                                                Xóa
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-success"
                                                onClick={() => paymentOrder(order._id)}
                                                disabled={loading} // Disable while loading
                                            >
                                                Thanh Toán
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal chỉnh sửa đơn hàng */}
            <Transition appear show={editModal} as={Fragment}>
                <Dialog as="div" open={editModal} onClose={() => setEditModal(false)} className="relative z-[51]">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="fixed inset-0 bg-black/60" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-full">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                                    <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] px-5 py-3">Cập Nhật Thông Tin Đơn Hàng</div>
                                    <div className="p-5">
                                        <form>
                                            <div className="mb-5">
                                                <label htmlFor="ID_User">User ID</label>
                                                <input id="ID_User" type="text" placeholder="User ID" className="form-input" value={params.ID_User} onChange={handleChange} />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="Total">Total</label>
                                                <input id="Total" type="text" placeholder="Total" className="form-input" value={params.Total} onChange={handleChange} />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="Status">Status</label>
                                                <input id="Status" type="text" placeholder="Status" className="form-input" value={params.Status} onChange={handleChange} />
                                            </div>
                                        </form>
                                    </div>
                                    <div className="flex justify-end items-center gap-2 p-5 border-t border-white-dark">
                                        <button type="button" className="btn btn-outline-danger" onClick={() => setEditModal(false)}>
                                            Đóng
                                        </button>
                                        <button type="button" className="btn btn-primary" onClick={handleUpdateOrder} disabled={loading}>
                                            Cập Nhật
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    )
}

export default OrderManagement
