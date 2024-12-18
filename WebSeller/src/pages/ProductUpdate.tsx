import { useState, useEffect } from 'react';
import { userProducts } from '../controller/ProductController';
import { useParams, useLocation } from "react-router-dom";

export default function ProductUpdate() {
    const { getProductById, editProduct } = userProducts();
    const location = useLocation();
    const queryString = location.search;
    const urlParams = new URLSearchParams(queryString);
    const id: string | null = urlParams.get('id');  // Lấy ID sản phẩm từ URL

    const [dataProduct, setDataProduct] = useState<any>({
        name: '',
        price: '',
        quantity: '',
        description: '',
        categoryId: '',
        images: []
    });

    // Lấy thông tin sản phẩm từ API
    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            try {
                const res: any = await getProductById(id);
                if (res.status) {
                    setDataProduct({
                        name: res.data.name,
                        price: res.data.price,
                        quantity: res.data.quantity,
                        description: res.data.description,
                        categoryId: res.data.categoryId,  // Giữ nguyên categoryId nếu cần
                        images: res.data.images
                    });
                } else {
                    alert("Failed to fetch product data");
                }
            } catch (error) {
                console.error("Error fetching product data:", error);
            }
        };
        fetchProduct();
    }, [id]);

    // Hàm chuyển hình ảnh thành base64
    const convertImageToBase64 = (file: File) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    // Xử lý sự kiện submit để cập nhật sản phẩm
    const clickUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const updatedProduct: any = {};

        // Lấy dữ liệu từ các input text
        for (const [key, value] of formData.entries()) {
            if (key === 'images') continue; // Bỏ qua trường images tạm thời
            const keys = key.split('.');
            if (keys.length > 1) {
                if (!updatedProduct[keys[0]]) updatedProduct[keys[0]] = {};
                updatedProduct[keys[0]][keys[1]] = value;
            } else {
                updatedProduct[key] = value;
            }
        }

        // Xử lý hình ảnh
        const imageFiles = formData.getAll('images') as File[];
        const base64Images = await Promise.all(imageFiles.map(file => convertImageToBase64(file)));

        // Gộp hình ảnh base64 vào dữ liệu sản phẩm
        updatedProduct.images = base64Images;

        // Cập nhật sản phẩm
        if (id) {
            const res: any = await editProduct(id, updatedProduct);
            if (res.status) {
                alert("Product updated successfully");
            } else {
                alert("Failed to update product");
            }
        }
    };

    // Hàm xử lý thay đổi giá trị input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDataProduct({
            ...dataProduct,
            [e.target.name]: e.target.value
        });
    };

    // Hàm xử lý thay đổi hình ảnh
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            setDataProduct({
                ...dataProduct,
                images: Array.from(files)
            });
        }
    };

    return (
        <form className="space-y-5" onSubmit={clickUpdate}>
            <div>
                <label htmlFor="productName">Product Name</label>
                <input 
                    id="productName" 
                    type="text" 
                    name="name" 
                    className="form-input" 
                    required 
                    value={dataProduct.name} 
                    onChange={handleChange} 
                />
            </div>

            <div>
                <label htmlFor="productPrice">Product Price</label>
                <input 
                    id="productPrice" 
                    type="text" 
                    name="price" 
                    className="form-input" 
                    required 
                    value={dataProduct.price} 
                    onChange={handleChange} 
                />
            </div>

            <div>
                <label htmlFor="productQuantity">Product Quantity</label>
                <input 
                    id="productQuantity" 
                    type="text" 
                    name="quantity" 
                    className="form-input" 
                    required 
                    value={dataProduct.quantity} 
                    onChange={handleChange} 
                />
            </div>

            <div>
                <label htmlFor="productDescription">Product Description</label>
                <input 
                    id="productDescription" 
                    type="text" 
                    name="description" 
                    className="form-input" 
                    required 
                    value={dataProduct.description} 
                    onChange={handleChange} 
                />
            </div>

            <div>
                <label htmlFor="productCategory">Product Category</label>
                <input 
                    id="productCategory" 
                    type="text" 
                    name="categoryId" 
                    className="form-input" 
                    required 
                    value={dataProduct.categoryId} 
                    onChange={handleChange} 
                />
            </div>

            <div>
                <label htmlFor="productImages">Images</label>
                <input 
                    id="productImages" 
                    type="file" 
                    name="images" 
                    multiple 
                    className="form-input" 
                    onChange={handleImageChange} 
                />
            </div>

            <button type="submit" className="btn btn-primary !mt-6">Submit</button>
        </form>
    );
}
