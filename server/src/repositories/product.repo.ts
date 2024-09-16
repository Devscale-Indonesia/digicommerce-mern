import productModel, { TProduct } from "../models/product.model";

export async function getAllProducts() {
   const products = await productModel.find().populate("authorId", "name");
   return products;
}

export async function getProductById(id: string) {
   const product = await productModel.findById(id);
   return product;
}

export async function createProduct(product: TProduct) {
   const newProduct = new productModel(product);
   const savedProduct = await newProduct.save();
   return savedProduct;
}

export async function updateProduct(productId: string, product: TProduct) {
   const updatedProduct = await productModel.findByIdAndUpdate(productId, product, { new: true });
   return updatedProduct;
}

export async function deleteProduct(productId: string) {
   const deletedProduct = await productModel.findByIdAndDelete(productId);
   return deletedProduct;
}
