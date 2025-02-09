import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order/order.service';
import { Order } from '../../models/Order';
import { OrderItem } from '../../models/OrderItem';
import { ProductService } from '../../services/product/product.service';
import { Product } from '../../models/Product';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-my-orders',
  standalone: false,
  
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css'],
})
export class MyOrdersComponent implements OnInit {
  orders: Order[] = [];
  expandedOrderId: number | null = null;
  productDetails: { [key: number]: Product | undefined } = {};

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getUserOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loadProductDetails();
      },
      error: (error) => {
        const errorMessage = error?.error?.error || 'Failed to load orders. Please try again.';
        this.snackBar.open(errorMessage, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
      },
    });
  }

  loadProductDetails(): void {
    const productIds = new Set<number>();
    this.orders.forEach((order) => {
      order.Items.forEach((item) => {
        productIds.add(item.ProductId);
      });
    });

    productIds.forEach((productId) => {
      this.productService.getProductById(productId).subscribe({
        next: (product) => {
          this.productDetails[productId] = product;
        },
        error: (error) => {
          console.error(`Failed to load product details for product ID ${productId}:`, error);
        },
      });
    });
  }

  toggleOrderDetails(orderId: number): void {
    this.expandedOrderId = this.expandedOrderId === orderId ? null : orderId;
  }

  isOrderExpanded(orderId: number): boolean {
    return this.expandedOrderId === orderId;
  }

  calculateOrderTotal(order: Order): number {
    return order.Items.reduce((total, item) => total + item.Price * item.Quantity, 0);
  }
}