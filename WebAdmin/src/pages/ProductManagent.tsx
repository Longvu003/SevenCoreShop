import { useEffect, useState } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../store';
import { setPageTitle } from '../store/themeConfigSlice';
import { userProducts } from '../controller/ProductController';
import { Products ,Category} from '../model/ProductModel';
import IconTrashLines from '../components/Icon/IconTrashLines';



const Tables = () => {
    const { getProduct,deleteProduct } = userProducts();
    const deleteProductById = async (id:string) => {
        const result:any = await deleteProduct(id);

        console.log(result.status);
        if(result.status === true){
            alert("Xóa Thành Công");
    }else{
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
                    <h5 className="font-semibold text-lg dark:text-white-light">Simple Table</h5>
                    <button type="button" className="btn btn-success">Thêm Sản Phẩm Mới</button>
                </div>
                <div className="table-responsive mb-5">
                    <table>
                        <thead>
                            <tr>
                                <th>Tên Sản Phẩm</th>
                                <th>Giá Thành</th>
                                <th>Số Lượng</th>
                                <th>Danh Mục</th>
                                <th className="text-center">Có Sẵn</th>
                                <th className="text-center">Actions</th>
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
                                        {product.avaialble ? "Yes" : "No"}
                                    </td>
                                    <td className="text-center">
                                    <button type="button" onClick={() => deleteProductById(product._id)}>
    <IconTrashLines className="m-auto" />
</button>

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
