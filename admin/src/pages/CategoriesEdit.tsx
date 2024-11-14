import { useState, useEffect } from 'react';
import { categoryController } from '../controller/CategoryController';
import { useParams, useLocation } from "react-router-dom";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function CategoryEdit() {
    const { getCategoriesById, updateCategories } = categoryController();
    const location = useLocation();
    const queryString = location.search;
    const urlParams = new URLSearchParams(queryString);
    const id: any = urlParams.get('id');    
    const [dataCategories, setDataCategories] = useState<any>({
        name: '',
        description: '',
    });

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res: any = await getCategoriesById(id);
                console.log(res.data);
                if (res.status) {
                    setDataCategories(() => ({
                        name: res.data.name,
                        description: res.data.description
                    }));
                } else {
                    MySwal.fire("Không thể lấy dữ liệu danh mục", "", "error");
                }
            } catch (error) {
                console.error("Error fetching category data:", error);
                MySwal.fire("Lỗi khi lấy dữ liệu danh mục", "", "error");
            }
        };
        fetchCategory();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDataCategories({
            ...dataCategories,
            [e.target.name]: e.target.value
        });
    };

    const clickUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (id === null) {
                MySwal.fire("Vui lòng điền đầy đủ thông tin", "", "warning");
                return;
            }
            const res: any = await updateCategories(id, dataCategories);
            if (res.status) {
                MySwal.fire("Cập nhật danh mục thành công", "", "success").then(() => {
                    window.location.href = '/categoriesmanagent';
                });
            } else {
                MySwal.fire("Cập nhật danh mục trùng tên", "", "error");
            }
        } catch (error) {
            console.error("Error updating category:", error);
            MySwal.fire("Cập nhật danh mục thất bại", "", "error");
        }
    };

    return (
        <form className="space-y-5" onSubmit={clickUpdate}>
            <div>
                <label htmlFor="productName">Tên danh mục sản phẩm</label>
                <input id="Name" type="text" name="name" className="form-input" value={dataCategories.name} required onChange={handleChange} />
            </div>

            <div>
                <label htmlFor="productDescription">Mô tả danh mục sản phẩm</label>
                <input id="Description" type="text" name="description" className="form-input" required value={dataCategories.description} onChange={handleChange} />
            </div>

            <button type="submit" className="btn btn-primary !mt-6">Lưu</button>
        </form>
    );
}
