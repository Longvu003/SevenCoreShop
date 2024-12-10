import { Link } from "react-router-dom"
import ReactApexChart from "react-apexcharts"
import { useDispatch, useSelector } from "react-redux"
import { IRootState } from "../store"
import PerfectScrollbar from "react-perfect-scrollbar"
import Dropdown from "../components/Dropdown"
import { useEffect, useState } from "react"
import { setPageTitle } from "../store/themeConfigSlice"
import IconHorizontalDots from "../components/Icon/IconHorizontalDots"
import IconTrendingUp from "../components/Icon/IconTrendingUp"
import IconPlus from "../components/Icon/IconPlus"
import IconCreditCard from "../components/Icon/IconCreditCard"
import IconMail from "../components/Icon/IconMail"
import IconChecks from "../components/Icon/IconChecks"
import IconFile from "../components/Icon/IconFile"
import IconServer from "../components/Icon/IconServer"
import { useOrders } from "../controller/OrderController"

const Analytics = () => {
    const { getTotalRevenue, getTotalOrder, getBestOrders, getTotalUnpaid } = useOrders()
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(setPageTitle("Analytics Admin"))
    })

    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === "dark" || state.themeConfig.isDarkMode)
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === "rtl" ? true : false

    // State lưu trữ dữ liệu từ API
    const [loading, setLoading] = useState<boolean>(true)
    const [totalRevenue, setTotalRevenue] = useState<number | null>(null) // State để lưu tổng doanh thu
    const [totalOrder, setTotalOrder] = useState<number | null>(null) // State để lưu tổng doanh thu
    const [totalOrderUnpaid, setTotalOrderUnpaid] = useState<number | null>(null) // State để lưu tổng doanh thu
    const [error, setError] = useState<string | null>(null) // State để lưu lỗi (nếu có)
    const [products, setProducts] = useState<any[]>([]) // State lưu danh sách sản phẩm

    // Gọi API lấy tổng doanh thu khi component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [revenue, order, orderUnpaid, bestOrders] = await Promise.all([getTotalRevenue(), getTotalOrder(), getTotalUnpaid(), getBestOrders()])
                setTotalRevenue(revenue)
                setTotalOrder(order)
                setTotalOrderUnpaid(orderUnpaid)
                setProducts(bestOrders)
            } catch (error) {
                setError("Không thể tải dữ liệu")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    // totalVisitOptions
    const totalVisit: any = {
        series: [{ data: [21, 9, 36, 12, 44, 25, 59, 41, 66, 25] }],
        options: {
            chart: {
                height: 58,
                type: "line",
                fontFamily: "Nunito, sans-serif",
                sparkline: {
                    enabled: true,
                },
                dropShadow: {
                    enabled: true,
                    blur: 3,
                    color: "#009688",
                    opacity: 0.4,
                },
            },
            stroke: {
                curve: "smooth",
                width: 2,
            },
            colors: ["#009688"],
            grid: {
                padding: {
                    top: 5,
                    bottom: 5,
                    left: 5,
                    right: 5,
                },
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: () => {
                            return ""
                        },
                    },
                },
            },
        },
    }
    // paidVisitOptions
    const paidVisit: any = {
        series: [{ data: [22, 19, 30, 47, 32, 44, 34, 55, 41, 69] }],
        options: {
            chart: {
                height: 58,
                type: "line",
                fontFamily: "Nunito, sans-serif",
                sparkline: {
                    enabled: true,
                },
                dropShadow: {
                    enabled: true,
                    blur: 3,
                    color: "#e2a03f",
                    opacity: 0.4,
                },
            },
            stroke: {
                curve: "smooth",
                width: 2,
            },
            colors: ["#e2a03f"],
            grid: {
                padding: {
                    top: 5,
                    bottom: 5,
                    left: 5,
                    right: 5,
                },
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: () => {
                            return ""
                        },
                    },
                },
            },
        },
    }

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/" className="text-primary hover:underline">
                        Dashboard
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Analytics</span>
                </li>
            </ul>
            <div className="pt-5">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    <div className="panel h-full sm:col-span-2 lg:col-span-1">
                        {/* statistics */}
                        <div className="flex justify-between dark:text-white-light mb-5">
                            <h5 className="font-semibold text-lg ">Thống kê đặt hàng</h5>
                            <div className="dropdown">
                                <Dropdown
                                    offset={[0, 5]}
                                    placement={`${isRtl ? "bottom-start" : "bottom-end"}`}
                                    btnClassName="hover:text-primary"
                                    button={<IconHorizontalDots className="text-black/70 dark:text-white/70 hover:!text-primary" />}
                                >
                                    <ul>
                                        <li>
                                            <button type="button">This Week</button>
                                        </li>
                                        <li>
                                            <button type="button">Last Week</button>
                                        </li>
                                        <li>
                                            <button type="button">This Month</button>
                                        </li>
                                        <li>
                                            <button type="button">Last Month</button>
                                        </li>
                                    </ul>
                                </Dropdown>
                            </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-8 text-sm text-[#515365] font-bold">
                            <div>
                                <div>
                                    <div>Đã thanh toán</div>
                                    <div className="text-[#f8538d] text-lg">
                                        {error ? (
                                            <p style={{ color: "red" }}>{error}</p> // Nếu có lỗi, hiển thị thông báo lỗi
                                        ) : totalOrder !== null ? (
                                            <p>{totalOrder}</p> // Hiển thị tổng doanh thu
                                        ) : (
                                            <p>Đang tải tổng doanh thu...</p> // Hiển thị khi chưa có dữ liệu
                                        )}
                                    </div>
                                </div>

                                <ReactApexChart series={totalVisit.series} options={totalVisit.options} type="line" height={58} className="overflow-hidden" />
                            </div>

                            <div>
                                <div>
                                    <div>Chưa thanh toán</div>
                                    <div className="text-[#f8538d] text-lg">
                                        {error ? (
                                            <p style={{ color: "red" }}>{error}</p> // Nếu có lỗi, hiển thị thông báo lỗi
                                        ) : totalOrderUnpaid !== null ? (
                                            <p>{totalOrderUnpaid}</p> // Hiển thị tổng doanh thu
                                        ) : (
                                            <p>Đang tải tổng doanh thu...</p> // Hiển thị khi chưa có dữ liệu
                                        )}
                                    </div>
                                </div>

                                <ReactApexChart series={paidVisit.series} options={paidVisit.options} type="line" height={58} className="overflow-hidden" />
                            </div>
                        </div>
                    </div>

                    <div className="panel h-full">
                        <div className="flex justify-between dark:text-white-light mb-5">
                            <h5 className="font-semibold text-lg ">Tra cứu doanh thu</h5>

                            <div className="dropdown">
                                <Dropdown
                                    offset={[0, 5]}
                                    placement={`${isRtl ? "bottom-start" : "bottom-end"}`}
                                    btnClassName="hover:text-primary"
                                    button={<IconHorizontalDots className="text-black/70 dark:text-white/70 hover:!text-primary" />}
                                >
                                    <ul>
                                        <li>
                                            <button type="button">7 ngày qua</button>
                                        </li>
                                        <li>
                                            <button type="button">7 ngày qua</button>
                                        </li>
                                        <li>
                                            <button type="button">30 ngày qua</button>
                                        </li>
                                        {/* <li>
                                            <button type="button">Last Month</button>
                                        </li> */}
                                    </ul>
                                </Dropdown>
                            </div>
                        </div>
                        <div className=" text-[#e95f2b] text-3xl font-bold my-10">
                            <span>$ 145,141 </span>
                            {/* <span className="text-black text-sm dark:text-white-light ltr:mr-2 rtl:ml-2">this week</span>
                            <IconTrendingUp className="text-success inline" /> */}
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="w-full rounded-full h-5 p-1 bg-dark-light overflow-hidden shadow-3xl dark:shadow-none dark:bg-dark-light/10">
                                <div
                                    className="bg-gradient-to-r from-[#4361ee] to-[#805dca] w-full h-full rounded-full relative before:absolute before:inset-y-0 ltr:before:right-0.5 rtl:before:left-0.5 before:bg-white before:w-2 before:h-2 before:rounded-full before:m-auto"
                                    style={{ width: "65%" }}
                                ></div>
                            </div>
                            <span className="ltr:ml-5 rtl:mr-5 dark:text-white-light">88%</span>
                        </div>
                    </div>

                    <div
                        className="panel h-full overflow-hidden before:bg-[#1937cc] before:absolute before:-right-44 before:top-0 before:bottom-0 before:m-auto before:rounded-full before:w-96 before:h-96 grid grid-cols-1 content-between"
                        style={{ background: "linear-gradient(0deg,#00c6fb -227%,#005bea)" }}
                    >
                        <div className="flex items-start justify-between text-white-light mb-16 z-[7]">
                            <h5 className="font-semibold text-lg">Total Balance</h5>

                            <div className="relative text-xl whitespace-nowrap">
                                {error ? (
                                    <p style={{ color: "red" }}>{error}</p> // Nếu có lỗi, hiển thị thông báo lỗi
                                ) : totalRevenue !== null ? (
                                    <p>{totalRevenue} VND</p> // Hiển thị tổng doanh thu
                                ) : (
                                    <p>Đang tải tổng doanh thu...</p> // Hiển thị khi chưa có dữ liệu
                                )}
                                <span className="table text-[#d3d3d3] bg-[#4361ee] rounded p-1 text-xs mt-1 ltr:ml-auto rtl:mr-auto">+ 2453</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between z-10">
                            <div className="flex items-center justify-between">
                                <button type="button" className="shadow-[0_0_2px_0_#bfc9d4] rounded p-1 text-white-light hover:bg-[#1937cc] place-content-center ltr:mr-2 rtl:ml-2">
                                    <IconPlus />
                                </button>
                                <button type="button" className="shadow-[0_0_2px_0_#bfc9d4] rounded p-1 text-white-light hover:bg-[#1937cc] grid place-content-center">
                                    <IconCreditCard />
                                </button>
                            </div>
                            <button type="button" className="shadow-[0_0_2px_0_#bfc9d4] rounded p-1 text-white-light hover:bg-[#4361ee] z-10">
                                Upgrade
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6 mb-6">
                    {/* Table */}
                    <div className="col-span-2 bg-white shadow rounded-lg p-5">
                        <h5 className="font-semibold text-lg mb-4">Bảng Chi Tiết</h5>
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-3">Đã bán</th>
                                    <th className="p-3">Tên Sản Phẩm</th>
                                    <th className="p-3">Giá</th>
                                    <th className="p-3">Chiết Khấu</th>
                                    <th className="p-3">Phí Giao Hàng</th>
                                    <th className="p-3">Doanh Số</th>
                                    <th className="p-3">Tồn Kho</th>
                                </tr>
                            </thead>

                            <tbody>
                                {products.map((product, index) => (
                                    <tr key={product._id} className="border-t">
                                        <td className="p-3">{product.totalSold}</td>
                                        <td className="p-3">{product.productInfo.name || "Không rõ tên"}</td>
                                        <td className="p-3">{product.productInfo.price}</td>
                                        <td className="p-3">0</td>
                                        <td className="p-3">0</td>
                                        <td className="p-3">{product.totalRevenue}</td>
                                        <td className="p-3">{product.productInfo.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="panel h-full">
                        <div className="flex items-start justify-between dark:text-white-light mb-5 -mx-5 p-5 pt-0 border-b  border-white-light dark:border-[#1b2e4b]">
                            <h5 className="font-semibold text-lg ">Sản Phẩm Bán Chạy</h5>
                            <div className="dropdown">
                                <Dropdown
                                    offset={[0, 5]}
                                    placement={`${isRtl ? "bottom-start" : "bottom-end"}`}
                                    btnClassName="hover:text-primary"
                                    button={<IconHorizontalDots className="text-black/70 dark:text-white/70 hover:!text-primary" />}
                                >
                                    <ul>
                                        <li>
                                            <button type="button">View All</button>
                                        </li>
                                        <li>
                                            <button type="button">Mark as Read</button>
                                        </li>
                                    </ul>
                                </Dropdown>
                            </div>
                        </div>
                        <PerfectScrollbar className="perfect-scrollbar relative h-[360px] ltr:pr-3 rtl:pl-3 ltr:-mr-3 rtl:-ml-3">
                            <div className="space-y-7">
                                {products.map((product, index) => (
                                    <div className="flex" key={product._id}>
                                        {/* Vòng tròn chỉ số */}
                                        <div className="shrink-0 ltr:mr-2 rtl:ml-2 relative z-10 before:w-[2px] before:h-[calc(100%-24px)] before:bg-white-dark/30 before:absolute before:top-10 before:left-4">
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                                                    ["bg-purple-500", "bg-green-500", "bg-blue-500", "bg-red-500", "bg-yellow-500"][index % 5]
                                                }`}
                                            >
                                                {index + 1}
                                            </div>
                                        </div>
                                        {/* Thông tin sản phẩm */}
                                        <div>
                                            <h5 className="font-semibold text-gray-800">
                                                Top {index + 1} : <span className="text-green-600 font-medium">{product.productInfo.name || "Không rõ tên"}</span>
                                            </h5>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </PerfectScrollbar>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Analytics
