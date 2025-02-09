import { Category } from "./Category";
import { Rating } from "./Rating";
import { Comment } from "./Comment";

export interface Product {
  ID: number;
  CategoryId: number;
  Name: string;
  Price: number;
	Description: string;
  Quantity: number;
	Image: string;
  Category: Category;
  Comments: Comment[];
  Ratings: Rating[];
}