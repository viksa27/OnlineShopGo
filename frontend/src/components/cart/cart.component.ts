import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartEntry } from '../../models/CartEntry';
import { Product } from '../../models/Product';
import { ProductService } from '../../services/product/product.service';
import {environment} from '../../environments/environment'
import {UPLOADS_RESOURCE_URL} from '../../helpers/constants'
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartEntries: { entry: CartEntry; product: Product }[] = [];
  totalPrice: number = 0;
  serverUrl: string = environment.serverUrl;
  uploadsUrl: string = UPLOADS_RESOURCE_URL;

  constructor(
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private productService: ProductService,
    private router: Router) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.productService.getProductsInCart().subscribe((products) => {
      this.cartEntries = products.map((product) => ({
        entry: { ID: 0, UserId: 0, ProductId: product.ID, Quantity: 1 }, // Default quantity (will update)
        product,
      }));

      this.cartService.getCartEntries().subscribe((entries) => {
        this.cartEntries.forEach((cartItem) => {
          const foundEntry = entries.find((entry) => entry.ProductId === cartItem.product.ID);
          if (foundEntry) {
            cartItem.entry.ID = foundEntry.ID;
            cartItem.entry.ProductId = foundEntry.ProductId;
            cartItem.entry.Quantity = foundEntry.Quantity;
            cartItem.entry.UserId = foundEntry.UserId;
          }
        });
        this.calculateTotalPrice();
      });
    });
  }

  calculateTotalPrice(): void {
    this.totalPrice = this.cartEntries.reduce((sum, item) => sum + item.product.Price * item.entry.Quantity, 0);
  }

  incrementQuantity(cartItem: { entry: CartEntry; product: Product }): void {
    this.updateQuantity(cartItem, cartItem.entry.Quantity + 1);
  }

  decrementQuantity(cartItem: { entry: CartEntry; product: Product }): void {
    if (cartItem.entry.Quantity > 1) {
      this.updateQuantity(cartItem, cartItem.entry.Quantity - 1);
    } else {
      this.removeFromCart(cartItem.product.ID);
    }
  }

  updateQuantity(cartItem: { entry: CartEntry; product: Product }, quantity: number): void {
    this.cartService.updateCartQuantity(cartItem.product.ID, quantity).subscribe({
      next: () => {
        cartItem.entry.Quantity = quantity;
        this.calculateTotalPrice();
        this.snackBar.open('Quantity updated!', 'Close', { duration: 2000 });
      },
      error: (error) => {
        const errorMessage = error?.error?.error || 'Error updating quantity.';
        this.snackBar.open(errorMessage, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
      },
    });
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId).subscribe({
      next: () => {
        this.cartEntries = this.cartEntries.filter((item) => item.product.ID !== productId);
        this.calculateTotalPrice();
        this.snackBar.open('Item removed!', 'Close', { duration: 2000 });
      },
      error: (error) => {
        const errorMessage = error?.error?.error || 'Error removing item.';
        this.snackBar.open(errorMessage, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
      },
    });
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe({
      next: () => {
        this.cartEntries = [];
        this.totalPrice = 0;
        this.snackBar.open('Cart cleared!', 'Close', { duration: 2000 });
      },
      error: (error) => {
        const errorMessage = error?.error?.error || 'Error clearing cart.';
        this.snackBar.open(errorMessage, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
      },
    });
  }

  placeOrder(): void {
    this.router.navigate(['/order']);
  }
}
