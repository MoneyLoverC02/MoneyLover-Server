import {Response} from "express";
import {User} from "../models/entity/User";
import {CustomRequest} from "../middlewares/auth";
import {Category} from "../models/entity/Category";
import {AppDataSource} from "../models/data-source";

class CategoryController {
    static categoryRepository = AppDataSource.getRepository(Category);
    static userRepository = AppDataSource.getRepository(User);

    static async getCategoryList(req: CustomRequest, res: Response) {
        try {
            const userID: number = req.token.userID;
            const categoryList: Category[] = await CategoryController.categoryRepository
                .createQueryBuilder("category")
                .leftJoinAndSelect("category.user", "user")
                .where("user.id = :userID OR category.user IS NULL", {userID})
                .getMany();
            if (categoryList.length > 0) {
                res.status(200).json({
                    message: "Get categoryList success",
                    categoryList: categoryList
                });
            } else {
                res.status(404).json({
                    message: 'No categories found',
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
            const user: User = await CategoryController.userRepository.findOneBy({id: userID});
            const {type, name} = req.body;
            const category: Category[] = await CategoryController.categoryRepository.find({
                where: {
                    name: name,
                    user: user
                }
            });
            if (category.length) {
                return res.status(500).json({
                    message: "Name of category already exist"
                });
            }
            const newCategory = {
                type: type,
                subType: "My categories",
                name: name,
                user: user
            };
            const savedCategory: Category = await CategoryController.categoryRepository.save(newCategory);
            if (savedCategory) {
                res.status(200).json({
                    message: "Create category success",
                    category: savedCategory
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