import {Component, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {saveAs} from 'file-saver';
import {LoaderService} from '../../services/loader.service';
import {AuthService} from '../../services/auth/auth.service';
import {ProductService} from '../../services/product/product.service';
import { CategoryService } from '../../services/category/category.service';
import {Product} from '../../models/Product'
import {environment} from '../../environments/environment'
import {UPLOADS_RESOURCE_URL} from '../../helpers/constants'
import {Category} from '../../models/Category'
import { CartService } from '../../services/cart/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-products',
  standalone: false,

  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  serverUrl: string = environment.serverUrl;
  uploadsUrl: string = UPLOADS_RESOURCE_URL;
  categories: Category[] = [];
  searchTerm: string = '';
  selectedCategory: number | null = null;

  private sub$ = new Subscription();

  constructor(private productService: ProductService,
      private categoryService: CategoryService,
      private cartService: CartService,
      private snackBar: MatSnackBar,
      private router: Router,
      private loaderService: LoaderService,
      private authService: AuthService) {
  }

  ngOnDestroy() {
  this.sub$.unsubscribe();
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();    
  }

  addToCart(productId: number): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    } 

    this.cartService.addToCart(productId).subscribe({
      next: () => {
        this.snackBar.open('Product added to cart!', 'Close', { duration: 2000 });
      },
      error: (error) => {
        const errorMessage = error?.error?.error || 'Error adding product to cart.';
        this.snackBar.open(errorMessage, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
      }
    });
  }

  viewProduct(productId: number): void {
    this.router.navigate([`/product-details/${productId}`]);
    return;
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe((products: Product[]) => {
      this.products = products;
      this.filteredProducts = products; // Initially show all products
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe((categories: Category[]) => {
      this.categories = categories;
    });
  }

  onSearchChange(): void {
    this.filterProducts();
  }

  onCategoryChange(): void {
    this.filterProducts();
  }

  filterProducts(): void {
    let filtered = this.products;

    // Filter by category
    if (this.selectedCategory !== null) {
      filtered = filtered.filter(product => product.CategoryId === this.selectedCategory);
    }

    // Filter by search term (name)
    if (this.searchTerm) {
      filtered = filtered.filter(product => product.Name.toLowerCase().includes(this.searchTerm.toLowerCase()));
    }

    this.filteredProducts = filtered;
  }
}
