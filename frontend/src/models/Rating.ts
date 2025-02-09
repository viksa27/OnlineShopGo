import { User } from "./User";

export interface Rating {  
    ID: number;
    UserId: number;
    ProductId: number;
    Rating: number;
    User: User;
}
