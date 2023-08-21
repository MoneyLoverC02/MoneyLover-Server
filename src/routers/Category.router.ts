import express from "express";
import CategoryController from "../controllers/Category.controller";

const categoryRouter = express.Router();

categoryRouter.get('/users/categories', CategoryController.getCategoryList);
categoryRouter.post('/users/categories', CategoryController.createCategory);

export default categoryRouter;