import { OrderItem } from "./OrderItem";

export interface Order {
    ID: number;
    UserID: number;
    Items: OrderItem[];
    ShippingAddress: string;
    PaymentMethod: string;
  }