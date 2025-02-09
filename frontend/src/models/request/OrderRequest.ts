import { OrderItemRequest } from "./OrderItemRequest";

export interface OrderRequest {
    Items: OrderItemRequest[];
    ShippingAddress: string;
    PaymentMethod: string;
  }