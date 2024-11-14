import { useEffect, useState } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../store';
import { setPageTitle } from '../store/themeConfigSlice';
import { Category } from '../model/CategoriesModel';
import { categoryController } from '../controller/CategoryController';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);


const Tables = () => {
    const { getCategories, deleteCategoriesById, } = categoryController();
    const [dataCategorie, setDataCategorie] = useState<Category[]>([]);


    const handleDelete = async (id: string) => {
        MySwal.fire({
            title: 'Bạn có chắc chắn muốn xóa?',
            text: 'Bạn sẽ không thể hoàn tác hành động này!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Vâng, xóa nó!',
            cancelButtonText: 'Hủy'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response: any = await deleteCategoriesById(id);
                console.log(response.status);
                if (response.status === true) {
                    MySwal.fire(
                        'Đã xóa!',
                        'Danh mục đã được xóa.',
                        'success'
                    ).then(() => {
                        window.location.reload(); // Thực hiện reload trang
                    });
                } else {
                    MySwal.fire(
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

    const dispatch = useDispatch();


    useEffect(() => {
        showData();
    }, []);

    useEffect(() => {
        dispatch(setPageTitle('Tables'));
    });

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

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
                                <th>Tên danh mục sản phẩm</th>
                                <th>Mô tả</th>
                                <th className="text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Hiển thị dữ liệu từ cate */}
                            {dataCategorie.map((Category) => (
                                <tr key={Category._id}>
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
