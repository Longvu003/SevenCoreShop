import { useState, useEffect } from 'react';
import { categoryController } from '../controller/CategoryController';
import { useLocation, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export default function CategoryEdit() {
    const { getCategoriesById, updateCategories } = categoryController();
    const location = useLocation();
    const navigate = useNavigate();
    const MySwal = withReactContent(Swal);
    const [images, setImages] = useState<string[]>([]);
    const queryString = location.search;
    const urlParams = new URLSearchParams(queryString);
    const id: any = urlParams.get('id');

    const [dataCategories, setDataCategories] = useState<any>({
        name: '',
        description: '',
        images: '',
    });
    const [originalName, setOriginalName] = useState<string>(''); // Lưu tên danh mục ban đầu để kiểm tra

    useEffect(() => {
        if (!id) {
            MySwal.fire("ID danh mục không tồn tại", "", "error").then(() => {
                navigate('/categoriesmanagent'); // Điều hướng về trang quản lý
            });
            return;
        }

        const fetchCategory = async () => {
            try {
                const res: any = await getCategoriesById(id);
                if (res.status) {
                    setDataCategories({
                        name: res.data.name,
                        description: res.data.description,
                        images: res.data.images || '',
                    });
                    setOriginalName(res.data.name); // Lưu tên gốc
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
        const { name, value, files } = e.target;

        if (name === 'images' && files) {
            // Khi chọn ảnh, chuyển ảnh thành URL tạm thời
            const newImage = URL.createObjectURL(files[0]);
            setDataCategories((prevState: any) => ({
                ...prevState,
                images: newImage,
            }));
        } else {
            setDataCategories((prevState: typeof dataCategories) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const clickUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!id) {
            MySwal.fire("ID danh mục không hợp lệ", "", "error");
            return;
        }

        const isNameChanged = dataCategories.name !== originalName;
        try {
            const res: any = await updateCategories(id, dataCategories);

            if (res.status) {
                MySwal.fire("Cập nhật danh mục thành công", "", "success").then(() => {
                    navigate('/categoriesmanagent');
                });
            } else if (isNameChanged) {
                MySwal.fire("Tên danh mục đã tồn tại", "", "error");
            } else {
                MySwal.fire("Cập nhật danh mục thất bại", "", "error");
            }
        } catch (error) {
            console.error("Error updating category:", error);
            MySwal.fire("Cập nhật danh mục thất bại", "", "error");
        }
    };

    const uploadToCloudinary = async () => {
        try {
            const fileInput = document.getElementById('categoriesImages') as HTMLInputElement;
            const file = fileInput?.files?.[0];
          if (file) {
            const data = new FormData();
            data.append('file', file);
            data.append('upload_preset', 'ml_default');

            const response = await fetch('https://api.cloudinary.com/v1_1/dlngxbn4l/image/upload', {
                method: 'POST',
                body: data
            });

            const result = await response.json();
            console.log('Uploaded image:', result['url']);
            setImages((prevImages) => [...prevImages, result['url']]);
            setDataCategories({
                ...dataCategories,
                images: result['url']
            });
        }
        } catch (error) {
          console.error("Error uploading images:", error);
        }
      };

    return (
        <form className="space-y-5" onSubmit={clickUpdate}>
            <div>
                <label htmlFor="productName">Tên danh mục sản phẩm</label>
                <input
                    id="Name"
                    type="text"
                    name="name"
                    className="form-input"
                    value={dataCategories.name}
                    required
                    onChange={handleChange}
                />
            </div>

            <div>
                <label htmlFor="productDescription">Mô tả danh mục sản phẩm</label>
                <input
                    id="Description"
                    type="text"
                    name="description"
                    className="form-input"
                    value={dataCategories.description}
                    required
                    onChange={handleChange}
                />
            </div>

            <div>
                <label htmlFor="categoriesImages">Hình ảnh</label>
                <input
                    id="categoriesImages"
                    type="file"
                    name="images"
                    onChange={uploadToCloudinary}
                    className="form-input file:py-2 file:px-4 file:border-0 file:font-semibold p-0 file:bg-primary/90 ltr:file:mr-5 rtl:file:ml-5 file:text-white file:hover:bg-primary"
                />
                <div style={{ margin: '10px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {dataCategories.images && (
                        <div style={{ position: 'relative' }}>
                            <img
                                src={dataCategories.images}
                                alt="Category Image"
                                style={{
                                    width: '200px',
                                    height: '200px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                }}
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setDataCategories((prevState: any) => ({
                                        ...prevState,
                                        images: '',
                                    }))
                                }
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
                    )}
                </div>
            </div>

            <button type="submit" className="btn btn-primary !mt-6">
                Lưu
            </button>
        </form>
    );
}
