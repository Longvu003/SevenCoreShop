import { useEffect, useState } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '../store/themeConfigSlice';
import { Category } from '../model/CategoriesModel';
import { categoryController } from '../controller/CategoryController';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';



const Tables = () => {
    const { getCategories, deleteCategoriesById } = categoryController();
    const [dataCategorie, setDataCategorie] = useState<Category[]>([]);
    const MySwal = withReactContent(Swal);


    const handleDelete = async (id: string) => {
        MySwal.fire({
            title: 'Bạn có chắc chắn muốn xóa?',
            text: 'Bạn sẽ không thể hoàn tác hành động này! việc xóa sẽ thất bại nếu danh mục này đang chứa sản phẩm',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa !',
            cancelButtonText: 'Hủy'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response: any = await deleteCategoriesById(id);
                console.log("gia tri " + response);
                if (response.status === true) {
                    const data: any = await getCategories();
                    console.log(data);
                    setDataCategorie(data.data);
                    await MySwal.fire(
                        'Đã xóa!',
                        'Danh mục đã được xóa.',
                        'success'
                    );
                } else {
                    await MySwal.fire(
                        'Lỗi!',
                        'Xóa danh mục thất bại.',
                        'error'
                    );
                }
            }
        });
    };


    // Hàm showData lấy dữ liệu từ API và lưu vào state
    const showData = async () => {
        const data: any = await getCategories();
        console.log(data.data);
        setDataCategorie(data.data);
    };

    useEffect(() => {
        showData();
    }, []);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Quản lý danh mục sản phẩm'));
    });


    return (
        <div className="grid xl:grid-cols-1 gap-12 grid-cols-1">
            {/* Simple Table */}
            <div className="panel">
                <div className="flex items-center justify-between mb-12">
                    <h5 className="font-semibold text-lg dark:text-white-light">Quản lí danh mục sản phẩm</h5>
                    <a href="/categoriesmanagent/categories-update" className="btn btn-success">+ Thêm danh mục sản phẩm</a>
                </div>
                <div className="table-responsive mb-5">
                    <table>
                        <thead>
                            <tr>
                                <th>Hình ảnh</th>
                                <th>Tên danh mục sản phẩm</th>
                                <th>Mô tả</th>
                                <th className="text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Hiển thị dữ liệu từ cate */}
                            {dataCategorie.map((Category) => (
                                <tr key={Category._id}>
                                    <td>
                                        {Array.isArray(Category.images) && Category.images.length > 0 ? (
                                            <img
                                            src={Category.images[0]} // Hiển thị URL đầu tiên trong mảng images
                                            alt={Category.name} // Thêm alt để mô tả
                                            style={{ width: '50px', height: '60px', objectFit: 'cover' }} // Đảm bảo kích thước và tỷ lệ ảnh đẹp
                                             />
                                            ) : (
                                            <span>Không có ảnh</span> // Hiển thị thông báo khi không có ảnh
                                            )}
                                    </td>
                                    <td>{Category.name}</td>
                                    <td>{Category.description}</td>
                                    <td>
                                        <div className="flex gap-4 items-center justify-center">
                                            <a href={`/categoriesmanagent/categories-edit?id=${Category._id}`} className="btn btn-sm btn-outline-primary">
                                                Chỉnh sửa
                                            </a>
                                            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(Category._id)}>
                                                Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Tables;
