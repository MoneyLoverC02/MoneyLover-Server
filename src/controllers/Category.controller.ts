import {Response} from "express";
import {CustomRequest} from "../middlewares/auth";
import {AppDataSource} from "../models/data-source";
import {Category} from "../models/entity/Category";

class CategoryController {
    static async getCategoryList(req: CustomRequest, res: Response) {
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

    static async createCategory(req: CustomRequest, res: Response) {
        try {
            const userID: number = req.token.userID;

        } catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    }

}

export default CategoryController;