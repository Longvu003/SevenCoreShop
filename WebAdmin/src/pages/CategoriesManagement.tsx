import { useEffect, useState } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../store';
import { setPageTitle } from '../store/themeConfigSlice';
import { userProducts } from '../controller/ProductController';
import { Category } from '../model/CategoriesModel';
import IconTrashLines from '../components/Icon/IconTrashLines';
import { categoryController } from '../controller/CategoryController';



const Tables = () => {
    const { createCategories, getCategories, deleteCategoriesById, updateCategories } = categoryController();
    const [dataCategorie, setDataCategorie] = useState<Category[]>([]);

    const showData = async () => {
        const data: any = await getCategories();
        console.log(data['data']);
        setDataCategorie(data['data']);
    };
    useEffect(() => {
        showData();
    }, []);

    const deleteCategories = async (id: string) => {
        const result: any = await deleteCategoriesById(id);
        console.log(result.status);
        if (result.status === true) {
            alert("Xóa Thành Công");
        } else {
            alert("Xóa Thất Bại");
        }
        showData();

    };

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;


    const dispatch = useDispatch();

    useEffect(() => {
        showData();
    }, []);

    useEffect(() => {
        dispatch(setPageTitle('Tables'));
    });

    return (
        <div className="grid xl:grid-cols-1 gap-12 grid-cols-1">
            {/* Simple Table */}
            <div className="panel">
                <div className="flex items-center justify-between mb-12">
                    <h5 className="font-semibold text-lg dark:text-white-light">Categories</h5>
                    <a href="/categoriesmanagent/categories-update" className="btn btn-success">New Categories</a>
                </div>
                <div className="table-responsive mb-5">
                    <table>
                        <thead>
                            <tr>
                                <th>Name Categories</th>
                                <th>description</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Hiển thị dữ liệu từ cate */}
                            {dataCategorie.map((Category) => (
                                <tr key={Category._id}>
                                    <td>{Category.name}</td>
                                    <td>{Category.description}</td>
                                    {/* <td className="text-center">
                                        <button type="button" onClick={() => (Category._id)}>
                                            <IconTrashLines className="m-auto" />
                                        </button>
                                    </td> */}
                                    <td>
                                        <div className="flex gap-4 items-center justify-center">
                                            <a href={`/categoriesmanagent/categories-edit?id=${Category._id}`} className="btn btn-sm btn-outline-primary">
                                                Chỉnh sửa Danh mục
                                            </a>

                                            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => deleteCategories(Category._id)}>
                                                Delete
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
