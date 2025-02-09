import { Component, OnInit } from '@angular/core';
import { Category } from '../../models/Category';
import { CategoryService } from '../../services/category/category.service';
import { CategoryRequest } from '../../models/request/CategoryRequest';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-category-management',
  standalone: false,

  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.css']
})
export class CategoryManagementComponent implements OnInit {
  categories: Category[] = [];
  newCategory: CategoryRequest = { Name: '', Description: '' };
  selectedCategory: Category | null = null;

  isEditDialogOpen: boolean = false;
  isAddDialogOpen: boolean = false;

  constructor(private categoryService: CategoryService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: () => {
        this.snackBar.open('Failed to load categories', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
      }
    });
  }

  openAddCategoryDialog(): void {
    this.newCategory = { Name: '', Description: '' }; // Reset the new category form
    this.isAddDialogOpen = true;
  }

  closeAddDialog(): void {
    this.isAddDialogOpen = false;
  }

  closeEditDialog(): void {
    this.isEditDialogOpen = false;
  }

  createCategory(): void {
    if (!this.newCategory.Name.trim() || !this.newCategory.Description.trim()) return;
    
    this.categoryService.createProduct(this.newCategory).subscribe({
      next: (category) => {
        this.categories.push(category);
        this.newCategory = { Name: '', Description: '' };
        this.snackBar.open('Category added successfully!', 'Close', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Failed to add category', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
      }
    });
  }

  editCategory(category: Category): void {
    this.selectedCategory = { ...category };
    this.isEditDialogOpen = true;
  }

  updateCategory(): void {
    if (!this.selectedCategory) return;

    if (!this.selectedCategory.Name.trim() || !this.selectedCategory.Description.trim()) return;

    const { ID, Name, Description } = this.selectedCategory;
    this.categoryService.updateCategory(ID, { Name, Description }).subscribe({
      next: (updatedCategory) => {
        const index = this.categories.findIndex((cat) => cat.ID === ID);
        if (index !== -1) this.categories[index] = updatedCategory;

        this.selectedCategory = null;
        this.snackBar.open('Category updated successfully!', 'Close', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Failed to update category', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
      }
    });
  }

  deleteCategory(id: number): void {
    this.categoryService.deleteProduct(id).subscribe({
      next: () => {
        this.categories = this.categories.filter(category => category.ID !== id);
        this.snackBar.open('Category deleted successfully!', 'Close', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Failed to delete category', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
      }
    });
  }
}
