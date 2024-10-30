import { useState } from 'react';
import { userProducts } from '../controller/ProductController';

export default function ProductUpdate() {
    const { updateProduct } = userProducts();
    const [dataProduct, setDataProduct] = useState<any>({
        name: '',
        price: '',
        quantity: '',
        description: '',
        category: {
        category_name: ''
        },
        images: []
    });

    // Hàm chuyển hình ảnh thành base64
    const convertImageToBase64 = (file: File) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const clickUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        const updatedProduct: any = {};

        // Lấy dữ liệu từ các input text
        for (const [key, value] of formData.entries()) {
            if (key === 'images') continue; // Bỏ qua trường images tạm thời
            const keys = key.split('.');
            if (keys.length > 1) {
                // Xử lý các trường có nhiều cấp (category.category_name)
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

        console.log(updatedProduct); // In ra toàn bộ dữ liệu product

        // Gọi API cập nhật sản phẩm nếu cần
        // updateProduct(updatedProduct); 
    };

    return (
        <form className="space-y-5" onSubmit={clickUpdate}>
            <div>
                <label htmlFor="productName">Product Name</label>
                <input id="productName" type="text" name="name" className="form-input" required />
            </div>

            <div>
                <label htmlFor="productPrice">Product Price</label>
                <input id="productPrice" type="text" name="price" className="form-input" required />
            </div>

            <div>
                <label htmlFor="productQuantity">Product Quantity</label>
                <input id="productQuantity" type="text" name="quantity" className="form-input" required />
            </div>

            <div>
                <label htmlFor="productDescription">Product Description</label>
                <input id="productDescription" type="text" name="description" className="form-input" required />
            </div>

            <div>
                <label htmlFor="productCategory">Product Categories</label>
                <select id="productCategory" name="category.category_name" className="form-select" required>
                    <option value="">Open this select menu</option>
                    <option value="One">One</option>
                    <option value="Two">Two</option>
                    <option value="Three">Three</option>
                </select>
            </div>

            <div>
                <label htmlFor="productImages">Images</label>
                <input id="productImages" type="file" name="images" multiple className="form-input" required />
            </div>

            <button type="submit" className="btn btn-primary !mt-6">Submit</button>
        </form>
    );
}
