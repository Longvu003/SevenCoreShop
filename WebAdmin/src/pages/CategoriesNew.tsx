import { useState } from 'react';
import { categoryController } from '../controller/CategoryController';
import { Navigate } from "react-router-dom";

export default function CategoryUpdate() {
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
        const res:any = await createCategories(dataCategories);
        console.log(res);   
        if(res.status === true){
            alert("Create Categories Success")
            location.href = "/categoriesmanagent";


    }else{
        alert("Create Categories Fail")
    }

    };
    

    return (
        <form className="space-y-5" onSubmit={clickCreateNew}>
            <div>
                <label htmlFor="productName">Categories Name</label>
                <input id="Name" type="text" name="name" className="form-input" required onChange={handleChange} />
            </div>

            <div>
                <label htmlFor="productDescription">Categories Description</label>
                <input id="Description" type="text" name="description" className="form-input" required  onChange={handleChange} />
            </div>

            <button type="submit" className="btn btn-primary !mt-6">Submit</button>
        </form>
    );
}
