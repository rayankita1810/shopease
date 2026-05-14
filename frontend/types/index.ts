export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
}

export interface CartItem {
  product: string; // product ID
  name: string;
  price: number;
  quantity: number;
  image?: string; 
}
