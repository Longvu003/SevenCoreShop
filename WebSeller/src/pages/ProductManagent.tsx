import { useEffect, useState } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../store';
import { setPageTitle } from '../store/themeConfigSlice';
import { userProducts } from '../controller/ProductController';
import { Products } from '../model/ProductModel';

import IconTrashLines from '../components/Icon/IconTrashLines';



const Tables = () => {
    const { getProduct, deleteProduct } = userProducts();
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

    // Sử dụng useState để lưu trữ dữ liệu từ API
    const [dataProduct, setDataProduct] = useState<Products[]>([]);

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
                                <th>Name Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Category</th>
                                {/* <th className="text-center">Available</th> */}
                                {/* <th className="text-center">Actions</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {/* Hiển thị dữ liệu từ dataProduct */}
                            {dataProduct.map((product) => (
                                <tr key={product._id}>
                                    <td>{product.name}</td>
                                    <td>{product.price}</td>
                                    <td>{product.quantity}</td>
                                    <td>{product.categoryId?.name || "Đang tải..."}</td>
                                    {/* <td className="text-center">
                                        {product.available ? "Yes" : "No"}
                                    </td> */}
                                    {/* <td className="text-center">
                                        <button type="button" onClick={() => deleteProductById(product._id)}>
                                            <IconTrashLines className="m-auto" />
                                        </button>

                                    </td> */}

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
