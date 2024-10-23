import { useState,useEffect } from 'react';
import { userProducts } from '../controller/ProductController';
//import { useParams, useHistory } from "react-router-dom";
import { Category } from '../model/CategoriesModel';
import { categoryController } from '../controller/CategoryController';
export default function ProductUpdate() {
    const queryString = location.search;
    const { getCategories, deleteCategoriesById,  } = categoryController();
    const [dataCategorie, setDataCategorie] = useState<Category[]>([]);
    const urlParams = new URLSearchParams(queryString);
    const id: any = urlParams.get('id');    
    const { editProduct,getProductById  } = userProducts();
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
    const showData = async () => {
        const data: any = await getCategories();
        console.log(data.data);
        setDataCategorie(data.data);
    };

    useEffect(() => {
        showData();
        const fetchProduct = async () => {
            try {
                const res: any = await getProductById(id);
                console.log(res.data);
                if (res.status) {
                    // setDataProduct({
                    //     name: res.data.name,
                    //     price: res.data.price,
                    //     quantity: res.data.quantity,
                    //     description: res.data.description,
                    //     category: {
                    //         category_name: res.data.category.category_name
                    //     },
                    //     images: res.data.images
                    // });
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.includes('category.')) {
            const categoryField = name.split('.')[1];
            setDataProduct((prevState: any) => ({
                ...prevState,
                category: {
                    ...prevState.category,
                    [categoryField]: value
                }
            }));
        } else {
            setDataProduct({
                ...dataProduct,
                [name]: value
            });
        }
    };

    const clickUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res: any = await editProduct(id, dataProduct);
            if (res.status) {
                alert("Update Product Success");
                //history.push("/productmanagent");
            } else {
                alert("Update Product Fail");
            }
        } catch (error) {
            console.error("Error updating product:", error);
            alert("Update Product Fail");
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
                <label htmlFor="productDescription">Product Description</label>
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
                <label htmlFor="productCategory">Product Categories</label>
                <select
                    id="productCategory"
                    name="category.category_name"
                    className="form-select"
                    value={dataProduct.category.category_name} // Set giá trị mặc định của category là category của sản phẩm
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
                <label htmlFor="productImages">Images</label>
                <input
                    id="productImages"
                    type="file"
                    name="images"
                    multiple
                    className="form-input"
                    onChange={handleChange}
                />
            </div>

            <button type="submit" className="btn btn-primary !mt-6">Submit</button>
        </form>
    );
}
