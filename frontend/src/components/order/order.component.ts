import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart/cart.service';
import { OrderService } from '../../services/order/order.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product/product.service';
import { CartEntry } from '../../models/CartEntry';
import { OrderRequest } from '../../models/request/OrderRequest';
import { OrderItemRequest } from '../../models/request/OrderItemRequest';
import { Product } from '../../models/Product';
import { Address } from '../../models/Address';
import { PaymentCard } from '../../models/PaymentCard';
import { AddressService } from '../../services/address/address.service';
import { PaymentCardService } from '../../services/card/card.service';

@Component({
  selector: 'app-order',
  standalone: false,
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit {
  cartEntries: CartEntry[] = [];
  products: Product[] = [];
  addresses: Address[] = [];
  paymentCards: PaymentCard[] = [];
  selectedCard: string = '';
  newCard: PaymentCard = {
    ID: 0,
    UserId: 0,
    Name: '',
    Number: '',
    Cvc: '',
    ExpiryMonth: 0,
    ExpiryYear: 0,
  };
  selectedAddress: string = '';
  newAddress: Address = {
    ID: 0,
    UserId: 0,
    Street: '',
    City: '',
    State: '',
    ZipCode: '',
    Country: '',
  };
  useNewCard: boolean = false;
  useNewAddress: boolean = false;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private productService: ProductService,
    private addressService: AddressService,
    private paymentCardService: PaymentCardService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
    this.loadAddresses();
    this.loadPaymentCards();
  }

  loadCart(): void {
    this.cartService.getCartEntries().subscribe({
      next: (entries) => {
        this.cartEntries = entries;
        this.loadProductsForCart();
      },
      error: (error) => {
        const errorMessage = error?.error?.error || 'Error loading cart.';
        this.snackBar.open(errorMessage, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
      },
    });
  }

  loadProductsForCart(): void {
    const productIds = this.cartEntries.map((entry) => entry.ProductId);
    this.productService.getProductsInCart().subscribe({
      next: (products) => {
        this.products = products.filter((product) => productIds.includes(product.ID));
      },
      error: (error) => {
        const errorMessage = error?.error?.error || 'Error loading products.';
        this.snackBar.open(errorMessage, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
      },
    });
  }

  loadAddresses(): void {
    this.addressService.getUserAddresses().subscribe({
      next: (response) => {
        this.addresses = response.addresses;
      },
      error: (error) => {
        const errorMessage = error?.error?.error || 'Error loading addresses.';
        this.snackBar.open(errorMessage, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
      },
    });
  }

  loadPaymentCards(): void {
    this.paymentCardService.getUserCards().subscribe({
      next: (response) => {
        this.paymentCards = response.cards;
      },
      error: (error) => {
        const errorMessage = error?.error?.error || 'Error loading payment cards.';
        this.snackBar.open(errorMessage, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
      },
    });
  }

  placeOrder(): void {
    if (!this.validateForm()) {
      return;
    }

    const orderItems: OrderItemRequest[] = this.cartEntries.map((entry) => ({
      ProductID: entry.ProductId,
      Quantity: entry.Quantity,
    }));

    const orderRequest: OrderRequest = {
      Items: orderItems,
      ShippingAddress: this.useNewAddress ? this.formatAddress(this.newAddress) : this.selectedAddress,
      PaymentMethod: this.useNewCard ? this.formatCard(this.newCard) : this.selectedCard,
    };

    this.orderService.createOrder(orderRequest).subscribe({
      next: (response) => {
        this.snackBar.open('Order placed successfully!', 'Close', {
          duration: 3000,
        });
        this.cartService.clearCart().subscribe(() => {
          this.router.navigate(['/success']);
        });
      },
      error: (error) => {
        const errorMessage = error?.error?.error || 'Failed to place order. Please try again.';
        this.snackBar.open(errorMessage, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
      },
    });
  }

  formatAddress(address: Address): string {
    return `${address.Street}, ${address.City}, ${address.State}, ${address.ZipCode}, ${address.Country}`;
  }

  formatCard(card: PaymentCard): string {
    return `${card.Name} - ${card.Number.slice(-4)} (Expires: ${card.ExpiryMonth}/${card.ExpiryYear})`;
  }

  getProductName(productId: number): string {
    const product = this.products.find((p) => p.ID === productId);
    return product ? product.Name : 'Unknown Product';
  }

  getProductPrice(productId: number): number {
    const product = this.products.find((p) => p.ID === productId);
    return product ? product.Price : 0;
  }

  validateForm(): boolean {
    if (this.cartEntries.length === 0) {
      this.snackBar.open('Your cart is empty.', 'Close', {
        duration: 3000,
      });
      return false;
    }

    if (!this.useNewCard && !this.selectedCard) {
      this.snackBar.open('Please select a card or enter new card details.', 'Close', {
        duration: 3000,
      });
      return false;
    }

    if (this.useNewCard && !this.validateCard(this.newCard)) {
      this.snackBar.open('Please enter valid card details.', 'Close', {
        duration: 3000,
      });
      return false;
    }

    if (!this.useNewAddress && !this.selectedAddress) {
      this.snackBar.open('Please select an address or enter a new address.', 'Close', {
        duration: 3000,
      });
      return false;
    }

    if (this.useNewAddress && !this.validateAddress(this.newAddress)) {
      this.snackBar.open('Please enter a valid address.', 'Close', {
        duration: 3000,
      });
      return false;
    }

    return true;
  }

  validateCard(card: PaymentCard): boolean {
    return (
      !!card.Name &&
      !!card.Number &&
      card.Number.length === 16 &&
      !!card.Cvc &&
      card.Cvc.length === 3 &&
      card.ExpiryMonth >= 1 &&
      card.ExpiryMonth <= 12 &&
      card.ExpiryYear >= new Date().getFullYear()
    );
  }

  validateAddress(address: Address): boolean {
    return (
      !!address.Street &&
      !!address.City &&
      !!address.State &&
      !!address.ZipCode &&
      !!address.Country
    );
  }
}