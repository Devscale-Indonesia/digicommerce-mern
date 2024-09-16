import UserModel, { TUser } from "../models/user.model";

export async function getAllUser() {
   const users = await UserModel.find();
   return users;
}

export async function getUserById(userId: string) {
   const user = await UserModel.findOne({ _id: userId });
   return user;
}

export async function getUserByEmail(email: string) {
   const user = await UserModel.findOne({ email });
   return user;
}

export async function createUser(user: TUser) {
   const newUser = new UserModel(user);
   const savedUser = await newUser.save();
   return savedUser;
}

export async function updateUser(userId: string, user: TUser) {
   const updatedUser = await UserModel.findByIdAndUpdate(userId, user, { new: true });
   return updatedUser;
}

export async function deleteUser(userId: string) {
   const deletedUser = await UserModel.findByIdAndDelete(userId);
   return deletedUser;
}
