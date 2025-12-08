import { response } from "express";
import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export async function createProduct(req,res) {

    if(! isAdmin(req)){
        return res.status(403).json({
            message: "Access denie.Admins only"
        })
    }



    const product=new Product(req.body)

    try{
        const response=await product.save()

        res.json({
            message:"Product created successfully",
            product:response
        })
    }catch(error){
        console.error("Error creating product",error);
        return res.status(500).json({
            message:"Failed "
        })
    }
    
}

export async function getProducts(req, res) {
    try {

        if (isAdmin(req)) {
            // Admin: show all products
            const products = await Product.find();
            return res.json(products);
        } else {
            // Normal users: show only available products
            const products = await Product.find({ isAvailable: true });
            return res.json(products);
        }

    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({
            message: "Failed to fetch products"
        });
    }
}


export async function deleteProduct(req,res) {
    if(!isAdmin(req)){
        res.status(403).json({
            message: "Access denied.Admin only"
           
        })
         return;
    }
    try{
       const productId=req.params.productId;
    
       await Product.deleteOne({
        productId : productId
       })
       res.json({
        message: "Product deleted successfully"
       })
       
    }catch(error){
      console.error("Error deleting product:",error);
      res.status(500).json({
        message:"Failed to delete product"
      })
      return
    }
}

export async function updateProduct(req,res) {
    if(!isAdmin(req)){
        res.status(403).json({
            message: "Access denied.Admin only"
            
        })
        return;
    }
    const data=req.body;
    const productId=req.params.productId;
    data.productId=productId; //to prevent updae Productid

    try{
        await Product.updateOne({
            productId: productId,
        },
    data
);
res.json({
    message: "product updated successfully"
})
    }catch(error){
        console.error("Error updating product:",error);
        res.status(500).json({
            message: "Failed to update"
        })
        return;
    }
}

export async function getProductInfo(req, res) {
    try {
        const productId = req.params.productId;

        // search by productId (string), NOT _id
        const product = await Product.findOne({ productId: productId });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (isAdmin(req) || product.isAvailable) {
            return res.json(product);
        } else {
            return res.status(404).json({ message: "Product is not available" });
        }

    } catch (error) {
        console.error("Error fetching product info:", error);
        return res.status(500).json({ message: "Failed to fetch product info" });
    }
}