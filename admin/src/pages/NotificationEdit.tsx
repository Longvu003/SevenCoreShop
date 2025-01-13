import { useState, useEffect } from 'react';
import { notificationController } from '../controller/NotificationController';
import { useLocation, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export default function NotificationEdit() {
    const { getNotificationById, UpdateNotification } = notificationController();
    const location = useLocation();
    const navigate = useNavigate();
    const MySwal = withReactContent(Swal);
    const queryString = location.search;
    const urlParams = new URLSearchParams(queryString);
    const id: any = urlParams.get('id');

    const [dataNotification, setDataNotification] = useState<any>({
        title: '',
        description: '',
        icon: '',
    });
    const [originalTitle, setOriginalTitle] = useState<string>(''); // Lưu tên danh mục ban đầu để kiểm tra

    useEffect(() => {
        if (!id) {
            MySwal.fire("ID thông báo không tồn tại", "", "error").then(() => {
                navigate('/notification-management'); // Điều hướng về trang quản lý
            });
            return;
        }

        const fetchNotification = async () => {
            try {
                const res: any = await getNotificationById(id);
                if (res.status) {
                    setDataNotification({
                        title: res.data.title,
                        description: res.data.description,
                        icon: res.data.icon || '',
                    });
                    setOriginalTitle(res.data.title); // Lưu tên gốc
                } else {
                    MySwal.fire("Không thể lấy dữ liệu thông báo", "", "error");
                }
            } catch (error) {
                console.error("Error fetching notification data:", error);
                MySwal.fire("Lỗi khi lấy dữ liệu thông báo", "", "error");
            }
        };
        fetchNotification();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;

        if (name === 'images' && files) {
            // Khi chọn ảnh, chuyển ảnh thành URL tạm thời
            const newImage = URL.createObjectURL(files[0]);
            setDataNotification((prevState: any) => ({
                ...prevState,
            }));
        } else {
            setDataNotification((prevState: typeof dataNotification) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const clickUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!id) {
            MySwal.fire("ID thông báo không hợp lệ", "", "error");
            return;
        }

        const isTitleChanged = dataNotification.title !== originalTitle;
        try {
            const res: any = await UpdateNotification(id, dataNotification);

            if (res.status) {
                MySwal.fire("Cập nhật thông báo thành công", "", "success").then(() => {
                    navigate('/notification-management');
                });
            } else if (isTitleChanged) {
                MySwal.fire("Title thông báo đã tồn tại", "", "error");
            } else {
                MySwal.fire("Cập nhật thông báo thất bại", "", "error");
            }
        } catch (error) {
            console.error("Error updating notification:", error);
            MySwal.fire("Cập nhật thông báo thất bại", "", "error");
        }
    };


    return (
        <form className="space-y-5" onSubmit={clickUpdate}>
            <div>
                <label htmlFor="Title">Title thông báo</label>
                <input
                    id="Title"
                    type="text"
                    name="title"
                    className="form-input"
                    value={dataNotification.title}
                    required
                    onChange={handleChange}
                />
            </div>

            <div>
                <label htmlFor="Description">Mô tả thông báo</label>
                <input
                    id="Description"
                    type="text"
                    name="description"
                    className="form-input"
                    value={dataNotification.description}
                    required
                    onChange={handleChange}
                />
            </div>

            <div>
                <label htmlFor="Icon">Icon</label>
                <input
                    id="Icon"
                    type="text"
                    name="icon"
                    className="form-input"
                    value={dataNotification.icon}
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
