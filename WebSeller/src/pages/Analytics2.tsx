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
    const [totalRevenue, setTotalRevenue] = useState<number | null>(null)
    const [totalOrder, setTotalOrder] = useState<number | null>(null)
    const [totalOrderUnpaid, setTotalOrderUnpaid] = useState<number | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [products, setProducts] = useState<any[]>([])

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
                                            <p style={{ color: "red" }}>{error}</p>
                                        ) : totalOrder !== null ? (
                                            <p>{totalOrder}</p>
                                        ) : (
                                            <p>Đang tải tổng doanh thu...</p>
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
                                            <p style={{ color: "red" }}>{error}</p>
                                        ) : totalOrderUnpaid !== null ? (
                                            <p>{totalOrderUnpaid}</p>
                                        ) : (
                                            <p>Đang tải tổng doanh thu...</p>
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
                                            <button type="button">30 ngày qua</button>
                                        </li>
                                    </ul>
                                </Dropdown>
                            </div>
                        </div>
                        <div className=" text-[#e95f2b] text-3xl font-bold my-10">
                            <span>$ 145,141 </span>
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
                        <div className="flex items-start justify-between text-white-light mb-16 z-10 pt-16 pr-10 pl-6">
                            <div>
                                <div className="text-xl font-bold mb-2">Lượt truy cập</div>
                                <div className="font-bold text-3xl">5,021</div>
                            </div>
                            <div className="text-white-light/60 dark:text-white-light/70 self-end">
                                <IconTrendingUp />
                            </div>
                        </div>

                        <div className="px-5 pb-5">
                            <ReactApexChart series={paidVisit.series} options={paidVisit.options} type="line" height={150} />
                        </div>
                    </div>
                </div>

                {/* best selling */}
                <div className="panel">
                    <div className="flex justify-between dark:text-white-light mb-5">
                        <h5 className="font-semibold text-lg">Sản phẩm bán chạy</h5>
                    </div>

                    <PerfectScrollbar
                        style={{
                            height: "300px",
                            overflowX: "hidden",
                        }}
                    >
                        <div>
                            {products?.map((product, index) => (
                                <div key={index} className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <div className="avatar w-10 h-10 rounded-full bg-light-gray">
                                            <img
                                                className="w-full h-full object-cover rounded-full"
                                                src={product.productInfo?.image || "https://dummyimage.com/150x150"}
                                                alt="product"
                                            />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-[#515365]">
                                                {product.productInfo?.name || "Không rõ tên sản phẩm"}
                                            </p>
                                            <span className="text-xs text-[#e95f2b]">Sold: {product.totalSold}</span>
                                        </div>
                                    </div>
                                    <span className="text-sm text-[#515365]">{product.totalRevenue}</span>
                                </div>
                            ))}
                        </div>
                    </PerfectScrollbar>
                </div>
            </div>
        </div>
    )
}

export default Analytics
