export interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  createdAt: string;
  authorId: {
    _id: string;
    name: string;
  };
}
