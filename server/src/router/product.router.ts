import express from "express";
import * as ProductRepo from "../repositories/product.repo";

const router = express.Router();

router.get("/", async (_, res) => {
   const products = await ProductRepo.getAllProducts();
   return res.json(products);
});

router.get("/:id", async (req, res) => {
   const { id } = req.params;

   try {
      const product = await ProductRepo.getProductById(id);
      return res.json(product);
   } catch (error) {
      console.log(error);
      return res.status(404).json({ message: "Product not found" });
   }
});

router.post("/", async (req, res) => {
   const product = req.body;

   const newProduct = await ProductRepo.createProduct(product);
   return res.json(newProduct);
});

router.delete("/:id", async (req, res) => {
   const { id } = req.params;

   try {
      const deletedProduct = await ProductRepo.deleteProduct(id);
      return res.json(deletedProduct);
   } catch (error) {
      console.log(error);
      return res.status(404).json({ message: "Product not found" });
   }
});

export default router;
