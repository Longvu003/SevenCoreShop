import { useState, useEffect } from 'react';
import { voucherController } from '../controller/VoucherController';
import { useLocation, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export default function VoucherEdit() {
    const { getVoucherById, UpdateVoucher } = voucherController();
    const location = useLocation();
    const navigate = useNavigate();
    const MySwal = withReactContent(Swal);
    const queryString = location.search;
    const urlParams = new URLSearchParams(queryString);
    const id: any = urlParams.get('id');

    const [dataVoucher, setDataVoucher] = useState<any>({
        code: '',
        titleVoucher: '',
        discountValue: '',
        minValue: '',
        quantity: '',
        expiryDate: '',
        status: '',

    });
    const [originalCode, setOriginalCode] = useState<string>(''); // Lưu tên danh mục ban đầu để kiểm tra

    useEffect(() => {
        if (!id) {
            MySwal.fire("ID voucher không tồn tại", "", "error").then(() => {
                navigate('/voucher-management'); // Điều hướng về trang quản lý
            });
            return;
        }

        const fetchVoucher = async () => {
            try {
                const res: any = await getVoucherById(id);
                if (res.status) {
                    setDataVoucher({
                        code: res.data.code || '',
                        titleVoucher: res.data.titleVoucher || '',
                        discountValue: res.data.discountValue || '',
                        minValue: res.data.minValue || '',
                        quantity: res.data.quantity || '',
                        expiryDate: res.data.expiryDate || '',
                        status: res.data.status || '',
                    });
                    setOriginalCode(res.data.code); // Lưu tên gốc
                } else {
                    MySwal.fire("Không thể lấy dữ liệu voucher", "", "error");
                }
            } catch (error) {
                console.error("Error fetching voucher data:", error);
                MySwal.fire("Lỗi khi lấy dữ liệu voucher", "", "error");
            }
        };
        fetchVoucher();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;

        if (name === 'images' && files) {
            // Khi chọn ảnh, chuyển ảnh thành URL tạm thời
            const newImage = URL.createObjectURL(files[0]);
            setDataVoucher((prevState: any) => ({
                ...prevState,
            }));
        } else {
            setDataVoucher((prevState: typeof dataVoucher) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const clickUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!id) {
            MySwal.fire("ID voucher không hợp lệ", "", "error");
            return;
        }

        const isTitleChanged = dataVoucher.code !== originalCode;
        try {
            const res: any = await UpdateVoucher(id, dataVoucher);

            if (res.status) {
                MySwal.fire("Cập nhật voucher thành công", "", "success").then(() => {
                    navigate('/voucher-management');
                });
            } else if (isTitleChanged) {
                MySwal.fire("Code voucher đã tồn tại", "", "error");
            } else {
                MySwal.fire("Cập nhật voucher thất bại", "", "error");
            }
        } catch (error) {
            console.error("Error updating voucher:", error);
            MySwal.fire("Cập nhật voucher thất bại", "", "error");
        }
    };


    return (
        <form className="space-y-5" onSubmit={clickUpdate}>
            <div>
                <label htmlFor="Code">Code voucher</label>
                <input
                    id="Code"
                    type="text"
                    name="code"
                    className="form-input"
                    value={dataVoucher.code}
                    required
                    onChange={handleChange}
                />
            </div>

            <div>
                <label htmlFor="TitleVoucher">Title voucher</label>
                <input
                    id="TitleVoucher"
                    type="text"
                    name="titleVoucher"
                    className="form-input"
                    value={dataVoucher.titleVoucher}
                    required
                    onChange={handleChange}
                />
            </div>

            <div>
                <label htmlFor="Discount">Discount</label>
                <input
                    id="Discount"
                    type="text"
                    name="discountValue"
                    className="form-input"
                    value={dataVoucher.discountValue}
                    required
                    onChange={handleChange}
                />
            </div>

            <div>
                <label htmlFor="Minvalue">Min value</label>
                <input
                    id="Minvalue"
                    type="text"
                    name="minValue"
                    className="form-input"
                    value={dataVoucher.minValue}
                    required
                    onChange={handleChange}
                />
            </div>

            <div>
                <label htmlFor="Quantity">Quantity</label>
                <input
                    id="Quantity"
                    type="text"
                    name="quantity"
                    className="form-input"
                    value={dataVoucher.quantity}
                    required
                    onChange={handleChange}
                />
            </div>

            <div>
                <label htmlFor="Status">Status</label>
                <input
                    id="Status"
                    type="text"
                    name="status"
                    className="form-input"
                    value={dataVoucher.status}
                    required
                    onChange={handleChange}
                />
            </div>


            <div>
                <label htmlFor="Date">Expiry Date</label>
                <input
                    id="Date"
                    type="text"
                    name="expiryDate"
                    className="form-input"
                    value={dataVoucher.expiryDate}
                    required
                    onChange={handleChange}
                />
            </div>


            <button type="submit" className="btn btn-primary !mt-6">
                Lưu
            </button>
        </form>
    );
}
