package dto

type CreateProductRequest struct {
	CategoryID  uint    `json:"CategoryId"`
	Name        string  `json:"Name" binding:"required"`
	Price       float64 `json:"Price" binding:"required"`
	Description string  `json:"Description" binding:"required"`
	Quantity    uint    `json:"Quantity" binding:"required"`
}
