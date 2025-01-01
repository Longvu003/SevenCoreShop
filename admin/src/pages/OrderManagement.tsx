import { useEffect, useState } from "react"
import Tippy from "@tippyjs/react"
import "tippy.js/dist/tippy.css"
import { useDispatch } from "react-redux"
import { setPageTitle } from "../store/themeConfigSlice"
import Swal from "sweetalert2"
import { OrderModel } from "../model/OrderModel"
import { orderController } from "../controller/OrderController"
import withReactContent from "sweetalert2-react-content"
import { format } from "date-fns"

const Tables = () => {
    const { getOrder, updateOrderStatus, updateOrderStatusPay } = orderController()
    const [dataOrder, setDataOrder] = useState<OrderModel[]>([])
    const MySwal = withReactContent(Swal)

    const showData = async () => {
        try {
            const data: any = await getOrder()
            console.log("Orders:", data)
            setDataOrder(data || [])
        } catch (error) {
            console.error("Error fetching orders:", error)
            setDataOrder([])
        }
    }

    useEffect(() => {
        showData()
    }, [])

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(setPageTitle("Quản lý đơn hàng"))
    }, [dispatch])

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
                                <th>Ngày tạo</th>
                                <th>Trạng thái thanh toán</th>
                                <th>Trạng thái vận chuyển</th>
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
                                        <td>{format(new Date(order.date), "HH:mm - dd/MM/yyyy")}</td>
                                        <td className="text-center whitespace-nowrap">
                                            <select
                                                className={`btn dropdown-toggle btn-dark ${
                                                    order.statuspay === "Đã thanh toán" ? "bg-success text-white" : order.statuspay === "Chưa thanh toán" ? "bg-danger text-white" : ""
                                                }`}
                                                value={order.statuspay}
                                                onChange={async (e) => {
                                                    const newStatuspay = e.target.value
                                                    console.log("Thay đổi trạng thái thanh toán:", newStatuspay, "cho đơn hàng:", order._id)
                                                    try {
                                                        const res = await updateOrderStatusPay(order._id, newStatuspay)
                                                        console.log("Kết quả từ API:", res)
                                                        if (res) {
                                                            showData()
                                                            MySwal.fire({
                                                                title: "Thành công",
                                                                text: `Trạng thái thanh toán đơn hàng đã được cập nhật thành ${newStatuspay}`,
                                                                icon: "success",
                                                                confirmButtonText: "OK",
                                                            })
                                                        }
                                                    } catch (error) {
                                                        console.error("Lỗi cập nhật trạng thái:", error)
                                                        MySwal.fire({
                                                            title: "Thất bại",
                                                            text: "Không thể cập nhật trạng thái thanh toán đơn hàng",
                                                            icon: "error",
                                                            confirmButtonText: "OK",
                                                        })
                                                    }
                                                }}
                                            >
                                                <option value="Đã thanh toán">Đã thanh toán</option>
                                                <option value="Đang xử lý">Chưa thanh toán</option>
                                            </select>
                                        </td>
                                        <td className="text-center whitespace-nowrap">
                                            <select
                                                className={`btn dropdown-toggle btn-dark ${
                                                    order.status === "Giao thành công"
                                                        ? "bg-success text-white"
                                                        : order.status === "Đã giao hàng"
                                                        ? "bg-primary text-white"
                                                        : order.status === "Đang xử lý"
                                                        ? "bg-warning text-dark"
                                                        : order.status === "Đã hủy"
                                                        ? "bg-danger text-white"
                                                        : ""
                                                }`}
                                                value={order.status}
                                                onChange={async (e) => {
                                                    const newStatus = e.target.value
                                                    try {
                                                        const res = await updateOrderStatus(order._id, newStatus)
                                                        console.log(res)
                                                        if (res) {
                                                            showData()
                                                            MySwal.fire({
                                                                title: "Thành công",
                                                                text: `Trạng thái đơn hàng đã được cập nhật thành ${newStatus}`,
                                                                icon: "success",
                                                                confirmButtonText: "OK",
                                                            })
                                                        }
                                                    } catch (error) {
                                                        console.error("Cập nhật trạng thái thất bại:", error)
                                                        MySwal.fire({
                                                            title: "Thất bại",
                                                            text: "Không thể cập nhật trạng thái đơn hàng",
                                                            icon: "error",
                                                            confirmButtonText: "OK",
                                                        })
                                                    }
                                                }}
                                            >
                                                <option value="Đã giao hàng">Đã giao hàng</option>
                                                <option value="Giao thành công">Giao thành công</option>
                                                <option value="Đang xử lý">Đang xử lý</option>
                                                <option value="Đã hủy">Đã hủy</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="text-center">
                                        Không có đơn hàng nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Tables
