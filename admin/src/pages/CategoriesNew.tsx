import { useState } from 'react';
import { categoryController } from '../controller/CategoryController';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';


export default function CategoryUpdate() {
    const MySwal = withReactContent(Swal);
    const { createCategories } = categoryController();
    const [dataCategories, setDataCategories] = useState<any>({
        name: '',
        description: '',
    });

    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDataCategories({
            ...dataCategories,
            [e.target.name]: e.target.value
        });
    };
    const clickCreateNew = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(dataCategories);        
        const res: any = await createCategories(dataCategories);
        console.log(res);   
        if (res.status === true) {
            MySwal.fire({
                title: 'Thành công',
                text: 'Thêm mới danh mục sản phẩm thành công',
                icon: 'success',
            }).then(() => {
                location.href = "/categoriesmanagent";
            });
        } else {
            MySwal.fire({
                title: 'Thất bại',
                text: 'Tên danh mục đã tồn tại',
                icon: 'error',
            });
        }
    };
    

    return (
        <form className="space-y-5" onSubmit={clickCreateNew}>
            <div>
                <label htmlFor="productName">Tên Danh mục sản phẩm</label>
                <input id="Name" type="text" name="name" className="form-input" required onChange={handleChange} />
            </div>

            <div>
                <label htmlFor="productDescription">Mô Tả danh mục sản phẩm</label>
                <input id="Description" type="text" name="description" className="form-input" required  onChange={handleChange} />
            </div>

            <button type="submit" className="btn btn-primary !mt-6">Lưu</button>
        </form>
    );
}
