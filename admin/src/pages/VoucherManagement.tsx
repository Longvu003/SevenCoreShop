import { useEffect, useState } from "react"
import Tippy from "@tippyjs/react"
import "tippy.js/dist/tippy.css"
import { useDispatch } from "react-redux"
import { setPageTitle } from "../store/themeConfigSlice"
import { Voucher } from "../model/VoucherModel"
import { voucherController } from "../controller/VoucherController"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const Tables = () => {
    const { getVoucher, deleteVoucherById } = voucherController()
    const [dataVoucher, setDataVoucher] = useState<Voucher[]>([])
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState(false)
    const MySwal = withReactContent(Swal)
    const dispatch = useDispatch()

    // Hàm lấy dữ liệu từ API
    const fetchData = async () => {
        setLoading(true) // Hiển thị trạng thái loading
        try {
            const response: any = await getVoucher()
            console.log("API Response:", response)
            if (response?.data) {
                setDataVoucher(response.data)
            } else {
                console.warn("API không trả về trường 'data'.")
                setDataVoucher([]) // Gán mảng rỗng nếu không có dữ liệu
            }
        } catch (error) {
            console.error("Error fetching Voucher:", error)
            setDataVoucher([]) // Gán mảng rỗng nếu xảy ra lỗi
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
                    const response: any = await deleteVoucherById(id)
                    if (response.status === true) {
                        await fetchData() // Lấy lại dữ liệu sau khi xóa
                        await MySwal.fire("Đã xóa!", "Voucher đã được xóa.", "success")
                    } else {
                        await MySwal.fire("Lỗi!", "Xóa Voucher thất bại.", "error")
                    }
                } catch (error) {
                    console.error("Error deleting Voucher:", error)
                    MySwal.fire("Lỗi!", "Không thể xóa Voucher.", "error")
                }
            }
            setDeleting(false)
        })
    }

    // Thiết lập tiêu đề trang và tải dữ liệu lần đầu
    useEffect(() => {
        dispatch(setPageTitle("Quản lý mã giảm giá"))
        fetchData() // Chỉ gọi API một lần
        return () => {
            setDataVoucher([]) // Xóa dữ liệu khi unmount
        }
    }, [dispatch]) // Không thêm `fetchData` vào dependencies

    return (
        <div className="grid xl:grid-cols-1 gap-12 grid-cols-1">
            <div className="panel">
                <div className="flex items-center justify-between mb-12">
                    <h5 className="font-semibold text-lg dark:text-white-light">Quản lí Voucher</h5>
                    <a href="/voucher/voucher-new" className="btn btn-success">
                        + Thêm Voucher
                    </a>
                </div>
                {loading ? (
                    <div className="text-center">Đang tải dữ liệu...</div>
                ) : (
                    <div className="table-responsive mb-5">
                        <table>
                            <thead>
                                <tr>
                                    <th>Code</th>
                                    <th>Title Voucher</th>
                                    <th>Giá trị giảm giá</th>
                                    <th>Số lượng giảm giá</th>
                                    {/* <th>Thời hạn giảm giá</th> */}
                                    <th>Trạng thái</th>
                                    <th className="text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataVoucher.length > 0 ? (
                                    dataVoucher.map((voucher) => (
                                        <tr key={voucher._id}>
                                            <td>{voucher.code}</td>
                                            <td>{voucher.titleVoucher}</td>
                                            <td>{voucher.discountValue}</td>
                                            <td>{voucher.quantity}</td>
                                            <td>{voucher.status}</td>
                                            <td>
                                                <div className="flex gap-4 items-center justify-center">
                                                    <button className="btn btn-sm btn-outline-primary">
                                                        <a href={`/voucher/voucher-edit?id=${voucher._id}`}>Chỉnh sửa</a>
                                                    </button>

                                                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(voucher._id)} disabled={deleting}>
                                                        {deleting ? "Đang xóa..." : "Xóa"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center">
                                            Không có voucher nào.
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
