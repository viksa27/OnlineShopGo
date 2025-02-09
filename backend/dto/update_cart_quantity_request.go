package dto

type UpdateCartQuantityRequest struct {
	ProductID uint `json:"ProductId" binding:"required"`
	Quantity  uint `json:"Quantity" binding:"required"`
}
