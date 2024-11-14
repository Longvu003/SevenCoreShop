import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { userProducts } from '../controller/ProductController';

export default function ProductCreateNew() {
    const { createProduct } = userProducts();
    const [categories, setCategories] = useState<any[]>([]);
    const [images, setImages] = useState<string[]>([]);
    const [dataProduct, setDataProduct] = useState<any>({
        name: '',
        price: '',
        quantity: '',
        description: '',
        category: {
            category_name: ''
        },
        images: '',
    });

    useEffect(() => {
        const getAllCategories = async () => {
            try {
                const response = await fetch('http://localhost:7777/categories');
                const result = await response.json();
                setCategories(result.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        getAllCategories();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === 'category_name') {
            setDataProduct((prevState: any) => ({
                ...prevState,
                category: {
                    ...prevState.category,
                    category_name: value
                }
            }));
        } else {
            setDataProduct((prevState: any) => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const uploadToCloudinary = async () => {
        try {
            const fileInput = document.getElementById('productImages') as HTMLInputElement;
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
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    const removeImage = (img: string) => {
        setImages((prevImages) => prevImages.filter(item => item !== img));
    };

    const clickCreateNew = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const newProduct = {
                ...dataProduct,
                price: Number(dataProduct.price),
                quantity: Number(dataProduct.quantity),
                category: dataProduct.category.category_name, // Assuming backend expects category ID
                images
            };
            console.log("Payload being sent to server:", newProduct);
            const res: any = await createProduct(newProduct);
            if (res.status) {
                Swal.fire({
                    icon: "success",
                    title: "Thành công",
                    text: "Thêm sản phẩm thành công"
                });
                location.href = "/product/product-managent";
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Thất bại",
                    text: "Thêm sản phẩm thất bại"
                });
            }
        } catch (error) {
            console.error("Error creating product:", error);
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: "Thêm sản phẩm thất bại"
            });
        }
    };

    return (
        <form className="space-y-5" onSubmit={clickCreateNew}>
            <div>
                <label htmlFor="productName">Tên Sản Phẩm</label>
                <input
                    id="productName"
                    type="text"
                    name="name"
                    value={dataProduct.name}
                    onChange={handleChange}
                    className="form-input"
                    required
                />
            </div>

            <div>
                <label htmlFor="productPrice">Giá bán</label>
                <input
                    id="productPrice"
                    type="number"
                    name="price"
                    value={dataProduct.price}
                    onChange={handleChange}
                    className="form-input"
                    required
                />
            </div>

            <div>
                <label htmlFor="productQuantity">Số lượng</label>
                <input
                    id="productQuantity"
                    type="number"
                    name="quantity"
                    value={dataProduct.quantity}
                    onChange={handleChange}
                    className="form-input"
                    required
                />
            </div>

            <div>
                <label htmlFor="productDescription">Mô tả sản phẩm</label>
                <input
                    id="productDescription"
                    type="text"
                    name="description"
                    value={dataProduct.description}
                    onChange={handleChange}
                    className="form-input"
                    required
                />
            </div>

            <div>
                <label htmlFor="productCategory">Danh mục sản phẩm</label>
                <select
                    id="productCategory"
                    name="category_name"
                    value={dataProduct.category.category_name}
                    onChange={handleChange}
                    className="form-multiselect text-white-dark"
                    required
                >
                    <option value="">Nhấn để chọn danh mục của sản phẩm</option>
                    {categories.map((item, index) => (
                        <option key={index} value={item._id}>{item.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="productImages">Hình ảnh</label>
                <input
                    id="productImages"
                    type="file"
                    name="images"
                    onChange={uploadToCloudinary}
                    className="form-input file:py-2 file:px-4 file:border-0 file:font-semibold p-0 file:bg-primary/90 ltr:file:mr-5 rtl:file:ml-5 file:text-white file:hover:bg-primary"
                    required
                />
                <div className="image-preview">
                    {images.map((img, index) => (
                        <div key={index} style={{ position: 'relative' }}>
                            <img
                                src={img}
                                alt="Product"
                                style={{ width: 150, height: 150, objectFit: 'cover' }}
                            />
                            <button
                                onClick={() => removeImage(img)}
                                style={{
                                    position: 'absolute',
                                    top: 10,
                                    left: 10,
                                    borderRadius: 15,
                                    height: 30,
                                    width: 30
                                }}
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <button type="submit" className="btn btn-primary !mt-6">
                Lưu
            </button>
        </form>
    );
}