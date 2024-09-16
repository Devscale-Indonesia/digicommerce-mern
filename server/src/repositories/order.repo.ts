import orderModel, { TOrder } from "../models/order.model";

export async function getAllOrdersByUser(userId: string) {
   const orders = await orderModel.find({ userId });
   return orders;
}

export async function createOrder(order: TOrder) {
   const newOrder = new orderModel(order);
   const savedOrder = await newOrder.save();
   return savedOrder;
}

export async function deleteOrder(orderId: string) {
   const deletedOrder = await orderModel.findByIdAndDelete(orderId);
   return deletedOrder;
}
