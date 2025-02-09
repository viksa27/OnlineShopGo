import { User } from "./User";

export interface Comment {  
    ID: number;
    UserId: number;
    ProductId: number;
    Content: string;
    User: User;
  }
  