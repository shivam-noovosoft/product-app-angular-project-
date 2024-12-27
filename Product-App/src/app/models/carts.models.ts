import {Product} from './products.models';

export interface Cart {
  carts: CartItems[];
  limit: number;
  skip: number;
  total: number;
}

export interface CartItems {
  id?: number;
  products: Product[];
  totalQuantity: number;
  userId: number;
}
