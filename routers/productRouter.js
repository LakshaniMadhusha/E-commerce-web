import express, { Router } from "express";
import { createProduct, deleteProduct, getProductInfo, getProducts, updateProduct } from "../controllers/productController.js";

const productRouter=express.Router();
productRouter.post("/",createProduct);
productRouter.get("/",getProducts);
productRouter.delete("/:productId", deleteProduct);
productRouter.put("/:productId",updateProduct)
productRouter.get("/:productId",getProductInfo);

export default productRouter;