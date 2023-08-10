import {Request, Response} from "express";
import {AppDataSource} from "../models/data-source";
import {Category} from "../models/entity/Category";

class CategoryController {
    static async getCategoryList(req: Request, res: Response) {
        try {
            const categoryRepository = AppDataSource.getRepository(Category);
            let categoryList = await categoryRepository.find();
            if (categoryList) {
                res.status(200).json({
                    message: "Get categoryList success",
                    categoryList: categoryList
                });
            }
        } catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    }
}

export default CategoryController;