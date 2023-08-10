import express from "express";
import CategoryController from "../controllers/Category.controller";

const categoryRouter = express.Router();

categoryRouter.get('/categories', CategoryController.getCategoryList);

export default categoryRouter;