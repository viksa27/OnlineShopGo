import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import { CategoryService } from '../../services/category/category.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Product } from '../../models/Product';
import { Category } from '../../models/Category';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateProductRequest } from '../../models/request/CreateProductRequest';

@Component({
  selector: 'app-create-product',
  standalone: false,

  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {
  categories: Category[] = [];
  selectedImage: File | null = null;

  newProduct: CreateProductRequest = {
    Name: '',
    Price: 0,
    Description: '',
    Quantity: 0,
    CategoryId: 0
  };

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit() {
    this.categoryService.getAllCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  onImageChange(event: any) {
    this.selectedImage = event.target.files[0];
  }

  addImageToProduct(id: number) {
      if (this.selectedImage == null) { return; }

    this.productService.addImageToProduct(id, this.selectedImage).subscribe({
      next: (response) => {
        this.router.navigate(['/products']);
      },
      error: (error) => {
        const errorMessage = error?.error?.error || 'Failed to add image to product';
        this.snackBar.open(errorMessage, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
      }
    });
  }

  onSubmit() {
    this.productService.createProduct(this.newProduct).subscribe({
      next: (response) => {
        this.snackBar.open('Product created successfully!', 'Close', { duration: 3000 });
        if (this.selectedImage) {
          this.addImageToProduct(response.ID);
        } else {
          this.router.navigate(['/products']);
        }
      },
      error: (error) => {
        const errorMessage = error?.error?.error || 'Failed to create product';
        this.snackBar.open(errorMessage, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
      }
    });
  }
}
