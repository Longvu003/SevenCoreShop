import { useState, useEffect } from 'react';
import { userProducts } from '../controller/ProductController';
import { Category } from '../model/CategoriesModel';
import { categoryController } from '../controller/CategoryController';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function ProductUpdate() {
    const queryString = location.search;
    const urlParams = new URLSearchParams(queryString);
    const { getCategories } = categoryController();
    const [dataCategorie, setDataCategorie] = useState<Category[]>([]);
    const id: any = urlParams.get('id');
    const { editProduct, getProductById } = userProducts();
    const [dataProduct, setDataProduct] = useState<any>({
        name: '',
        price: '',
        quantity: '',
        description: '',
        category: {
            category_name: '',
            category_id: ''
        },
        images: []
    });
    const [loading, setLoading] = useState(false);  // Thêm trạng thái loading

    // Lấy danh sách các danh mục
    const showData = async () => {
        try {
            const data: any = await getCategories();
            setDataCategorie(data.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
            MySwal.fire("Lỗi", "Không thể tải danh mục", "error");
        }
    };

    // Lấy thông tin sản phẩm khi render
    useEffect(() => {
        showData();
        const fetchProduct = async () => {
            try {
                const res: any = await getProductById(id);
                if (res.status) {
                    setDataProduct({
                        name: res.data.name,
                        price: res.data.price,
                        quantity: res.data.quantity,
                        description: res.data.description,
                        category: {
                            category_name: res.data.category.category_name,
                            category_id: res.data.category._id  // Lấy ID của danh mục
                        },
                        images: Array.isArray(res.data.images) ? res.data.images : []
                    });
                } else {
                    alert("Failed to fetch product data");
                }
            } catch (error) {
                console.error("Error fetching product data:", error);
                alert("Error fetching product data");
            }
        };
        fetchProduct();
    }, [id]);

    // Xử lý thay đổi trong form
    const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, files } = e.target as HTMLInputElement;

        if (name.includes('category.')) {
            const categoryField = name.split('.')[1];
            setDataProduct((prevState: any) => ({
                ...prevState,
                category: {
                    ...prevState.category,
                    [categoryField]: value
                }
            }));
        } else if (name === 'images' && files) {
            const newImages = Array.from(files).map(file => URL.createObjectURL(file));
            setDataProduct((prevState: any) => ({
                ...prevState,
                images: [...prevState.images, ...newImages]  // Thêm hình ảnh vào danh sách hình ảnh
            }));
        } else {
            setDataProduct((prevState: any) => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    // Cập nhật sản phẩm
    const clickUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Kiểm tra xem category_id có hợp lệ không
        if (!dataProduct.category || !dataProduct.category.category_id) {
            MySwal.fire("Danh mục không hợp lệ", "", "error");
            return;
        }

        // Chỉ gửi category_id thay vì đối tượng category
        const updatedData = {
            ...dataProduct,
            category: dataProduct.category.category_id,  // Chỉ gửi category_id
        };

        setLoading(true);  // Bật trạng thái loading

        try {
            const res: any = await editProduct(id, updatedData);  // Gửi dữ liệu cập nhật

            // Kiểm tra trạng thái của phản hồi (nếu API trả về status)
            if (res && res.status === 'success') {
                MySwal.fire("Cập nhật sản phẩm thành công", "", "success").then(() => {
                    window.location.href = '/product/product-managent';  // Điều hướng về trang quản lý sản phẩm
                });
            } else {
                MySwal.fire("Cập nhật sản phẩm thất bại", "", "error");
            }
        } catch (error) {
            console.error("Error updating product:", error);
            MySwal.fire("Cập nhật sản phẩm thất bại", "", "error");
        } finally {
            setLoading(false);  // Tắt trạng thái loading
        }
    };

    return (
        <form className="space-y-5" onSubmit={clickUpdate}>
            <div>
                <label htmlFor="productName">Tên sản phẩm</label>
                <input
                    id="productName"
                    type="text"
                    name="name"
                    className="form-input"
                    value={dataProduct.name}
                    required
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="productPrice">Giá bán</label>
                <input
                    id="productPrice"
                    type="number"
                    name="price"
                    className="form-input"
                    value={dataProduct.price}
                    required
                    onChange={handleChange}
                />
            </div>

            <div>
                <label htmlFor="productQuantity">Số lượng</label>
                <input
                    id="productQuantity"
                    type="number"
                    name="quantity"
                    className="form-input"
                    value={dataProduct.quantity}
                    required
                    onChange={handleChange}
                />
            </div>

            <div>
                <label htmlFor="productDescription">Mô tả</label>
                <input
                    id="productDescription"
                    type="text"
                    name="description"
                    className="form-input"
                    value={dataProduct.description}
                    required
                    onChange={handleChange}
                />
            </div>

            <div>
                <label htmlFor="productCategory">Danh mục</label>
                <select
                    id="productCategory"
                    name="category.category_id"  // Dùng category_id thay vì category_name
                    className="form-select"
                    value={dataProduct.category.category_id} // Set ID của danh mục đã chọn
                    required
                    onChange={handleChange}
                >
                    {dataCategorie.map((Category) => (
                        <option key={Category._id} value={Category._id}>
                            {Category.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="productImages">Hình ảnh</label>
                <input
                    id="productImages"
                    type="file"
                    name="images"
                    multiple
                    className="form-input file:py-2 file:px-4 file:border-0 file:font-semibold p-0 file:bg-primary/90 ltr:file:mr-5 rtl:file:ml-5 file:text-white file:hover:bg-primary"
                    onChange={handleChange}
                />
                <div style={{ margin: '10px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {Array.isArray(dataProduct.images) && dataProduct.images.map((image: string, index: number) => (
                        <div key={index} style={{ position: 'relative' }}>
                            <img
                                src={image}
                                alt={`Product Image ${index + 1}`}
                                style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setDataProduct((prevState: any) => ({
                                        ...prevState,
                                        images: prevState.images.filter((_: string, i: number) => i !== index), // Xóa hình ảnh
                                    }));
                                }}
                                style={{
                                    position: 'absolute',
                                    top: 5,
                                    right: 5,
                                    backgroundColor: 'red',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '20px',
                                    height: '20px',
                                    cursor: 'pointer',
                                }}
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <button type="submit" className="btn btn-primary !mt-6" disabled={loading}>
                {loading ? 'Đang cập nhật...' : 'Lưu'}
            </button>
        </form>
    );
}
