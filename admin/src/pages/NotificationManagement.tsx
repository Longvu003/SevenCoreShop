import { useEffect, useState } from "react"
import Tippy from "@tippyjs/react"
import "tippy.js/dist/tippy.css"
import { useDispatch } from "react-redux"
import { setPageTitle } from "../store/themeConfigSlice"
import { Notification } from "../model/NotificationModel"
import { notificationController } from "../controller/NotificationController"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const Tables = () => {
    const { getNotification, deleteNotificationById } = notificationController()
    const [dataNotification, setDataNotification] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState(false)
    const MySwal = withReactContent(Swal)
    const dispatch = useDispatch()

    // Hàm lấy dữ liệu từ API
    const fetchData = async () => {
        setLoading(true) // Hiển thị trạng thái loading
        try {
            const response: any = await getNotification()
            console.log("API Response:", response)
            if (response?.data) {
                setDataNotification(response.data)
            } else {
                console.warn("API không trả về trường 'data'.")
                setDataNotification([]) // Gán mảng rỗng nếu không có dữ liệu
            }
        } catch (error) {
            console.error("Error fetching notifications:", error)
            setDataNotification([]) // Gán mảng rỗng nếu xảy ra lỗi
        } finally {
            setLoading(false) // Tắt trạng thái loading sau khi hoàn tất
        }
    }

    // Hàm xử lý xóa thông báo
    const handleDelete = async (id: string) => {
        if (deleting) return // Tránh xử lý xóa khi đang trong trạng thái xóa
        setDeleting(true)
        MySwal.fire({
            title: "Bạn có chắc chắn muốn xóa?",
            text: "Bạn sẽ không thể hoàn tác hành động này!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Xóa!",
            cancelButtonText: "Hủy",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response: any = await deleteNotificationById(id)
                    if (response.status === true) {
                        await fetchData() // Lấy lại dữ liệu sau khi xóa
                        await MySwal.fire("Đã xóa!", "Thông báo đã được xóa.", "success")
                    } else {
                        await MySwal.fire("Lỗi!", "Xóa thông báo thất bại.", "error")
                    }
                } catch (error) {
                    console.error("Error deleting notification:", error)
                    MySwal.fire("Lỗi!", "Không thể xóa thông báo.", "error")
                }
            }
            setDeleting(false)
        })
    }

    // Thiết lập tiêu đề trang và tải dữ liệu lần đầu
    useEffect(() => {
        dispatch(setPageTitle("Quản lý danh mục sản phẩm"))
        fetchData() // Chỉ gọi API một lần
        return () => {
            setDataNotification([]) // Xóa dữ liệu khi unmount
        }
    }, [dispatch]) // Không thêm `fetchData` vào dependencies

    return (
        <div className="grid xl:grid-cols-1 gap-12 grid-cols-1">
            <div className="panel">
                <div className="flex items-center justify-between mb-12">
                    <h5 className="font-semibold text-lg dark:text-white-light">Quản lí thông báo</h5>
                    <a href="/notification/notification-new" className="btn btn-success">
                        + Thêm thông báo
                    </a>
                </div>
                {loading ? (
                    <div className="text-center">Đang tải dữ liệu...</div>
                ) : (
                    <div className="table-responsive mb-5">
                        <table>
                            <thead>
                                <tr>
                                    <th>Icon</th>
                                    <th>Title thông báo</th>
                                    <th>Mô tả</th>
                                    <th className="text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataNotification.length > 0 ? (
                                    dataNotification.map((notification) => (
                                        <tr key={notification._id}>
                                            <td>{notification.icon}</td>
                                            <td>{notification.title}</td>
                                            <td>{notification.description}</td>
                                            <td>
                                                <div className="flex gap-4 items-center justify-center">
                                                    <button className="btn btn-sm btn-outline-primary">
                                                        <a href={`/notification/notification-edit?id=${notification._id}`}>Chỉnh sửa</a>
                                                    </button>

                                                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(notification._id)} disabled={deleting}>
                                                        {deleting ? "Đang xóa..." : "Xóa"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center">
                                            Không có thông báo nào.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Tables
