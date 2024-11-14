import { useEffect, useState } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../store';
import { setPageTitle } from '../store/themeConfigSlice';
import { userProducts } from '../controller/ProductController';
import { Products, Category } from '../model/ProductModel';



const Tables = () => {
    const { getProduct, deleteProduct } = userProducts();
    // Sử dụng useState để lưu trữ dữ liệu từ API
    const [dataProduct, setDataProduct] = useState<Products[]>([]);

    const deleteProductById = async (id: string) => {
        const result: any = await deleteProduct(id);
        console.log(result.status);
        if (result.status === true) {
            alert("Xóa Thành Công");
        } else {
            alert("Xóa Thất Bại");
        }
        showData();

    };

    // Hàm showData lấy dữ liệu từ API và lưu vào state
    const showData = async () => {
        const data: any = await getProduct();
        console.log(data.data);
        setDataProduct(data.data);
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
                    <h5 className="font-semibold text-lg dark:text-white-light">Quản lý sản phẩm</h5>
                    <a href="/product/product-createnew" className="btn btn-success">+ Thêm sản phẩm mới</a>
                </div>
                <div className="table-responsive mb-5">
                    <table>
                        <thead>
                            <tr>
                                <th>Tên sản phẩm</th>
                                <th>Giá bán</th>
                                <th>Số lượng</th>
                                <th>Danh mục sản phẩm</th>
                                <th className="text-center">Hoạt động</th>
                                <th className="text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Hiển thị dữ liệu từ dataProduct */}
                            {dataProduct.map((product) => (
                                <tr key={product._id}>
                                    <td>{product.name}</td>
                                    <td>{product.price}</td>
                                    <td>{product.quantity}</td>
                                    <td>{product.category.category_name}</td>
                                    <td className="text-center">
                                        {product.avaialble ? "Đang hoạt động" : "Chưa hoạt động"}
                                    </td>
                                    <td>
                                        <div className="flex gap-4 items-center justify-center">
                                            <a href={`/product/product-update?id=${product._id}`} className="btn btn-sm btn-outline-primary">
                                                Chỉnh sửa
                                            </a>

                                            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => deleteProductById(product._id)}>
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
