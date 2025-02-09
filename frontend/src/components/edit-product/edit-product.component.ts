import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../services/category/category.service';
import { Product } from '../../models/Product';
import { Category } from '../../models/Category';
import { ProductService } from '../../services/product/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateProductRequest } from '../../models/request/CreateProductRequest';
import {UPLOADS_RESOURCE_URL} from '../../helpers/constants'
import {environment} from '../../environments/environment'



@Component({
  selector: 'app-edit-product',
  standalone: false,

  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  productId: number;
  product: Product = {
    ID: 0,
    CategoryId: 0, 
    Name: "",
    Price: 0,
    Description: "",
    Quantity: 0,
    Image: "",
    Category: {
      ID: 0,
      Name: "",
      Description: ""
    },
    Comments: [],
    Ratings: [],
  };
  categories: Category[] = [];
  selectedCategory: Category | null = null;
  selectedImage: File | null = null;
  serverUrl: string = environment.serverUrl;
  uploadsUrl: string = UPLOADS_RESOURCE_URL;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.productId = 0;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productId = params['id'];
      this.loadCategories();
      this.loadProduct();
    });
  }

  findCategoryById(categoryId: number): Category | null {
    return this.categories.find(category => category.ID === categoryId) ?? null;
  }

  loadProduct(): void {
    this.productService.getProductById(this.productId).subscribe({
      next: (response) => {
        this.product = response;
        this.selectedCategory = this.findCategoryById(response.Category.ID);
      },
      error: (error) => {
        const errorMessage = error?.error?.error || 'Could not load product';
        this.snackBar.open(errorMessage, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        this.categories = response;
      },
      error: (error) => {
        const errorMessage = error?.error?.error || 'Could not load categories.';
        this.snackBar.open(errorMessage, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
      }
    });
  }

  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
    }
  }

  deleteImage(): void {
    if (this.productId) {
      this.productService.removeImageFromProduct(this.productId).subscribe({
        next: (response) => {
          this.snackBar.open('Image deleted successfully!', 'Close', { duration: 3000 });
          if (!this.product) { return; }
          this.product.Image = "no_image.png";
          this.selectedImage = null;
        },
        error: (error) => {
          const errorMessage = error?.error?.error || 'Could not delete image.';
          this.snackBar.open(errorMessage, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
        }
      });
    }
  }

  saveProduct(): void {
    if (this.selectedImage) {
      this.productService.addImageToProduct(this.productId, this.selectedImage).subscribe({
        next: (response) => {
          if (this.product) {
            this.product.Image = response.Image;
          }
          this.selectedImage = null;
        },
        error: (error) => {
          const errorMessage = error?.error?.error || 'Could not delete image.';
          this.snackBar.open(errorMessage, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
        }
      });
    }

    this.updateProductDetails();
  }

  updateProductDetails(): void {
    if (!this.product) { return; }
    if (!this.selectedCategory) { return; }
    this.product.Category = this.selectedCategory;

    const req: CreateProductRequest = {
      CategoryId: this.selectedCategory.ID,
      Name: this.product.Name,
      Price: this.product.Price,
      Description: this.product.Description,
      Quantity: this.product.Quantity
    }

    this.productService.updateProduct(this.productId, req).subscribe({
      next: (response) => {
        this.product = response;
        this.snackBar.open('Product updated successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/products']);
      },
      error: (error) => {
        const errorMessage = error?.error?.error || 'Could not delete image.';
        this.snackBar.open(errorMessage, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
      }
    });
  }

  deleteProduct(): void {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      this.productService.deleteProduct(this.productId).subscribe({
        next: () => {
          this.snackBar.open('Product deleted successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/products']);
        },
        error: (error) => {
          const errorMessage = error?.error?.error || 'Failed to delete product';
          this.snackBar.open(errorMessage, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
        }
      });
    }
  }
}
